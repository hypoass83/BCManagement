// employee.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { EmployeeModel, EmployeeService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { EMPLOYEE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/employee-columns-defs';

@Component({
  selector: 'app-employees',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeesComponent implements OnInit {
  public rowData = signal<EmployeeModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public employeeToEdit: EmployeeModel | null = null;

  constructor(
    private employeeService: EmployeeService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createEmployee() {
    this.employeeToEdit = null;
    openModal('employee-create-form');
  }

  onEdit(data: EmployeeModel) {
    this.employeeToEdit = data;
    openModal('employee-create-form');
  }

  async onDelete(data: EmployeeModel) {
    try {
      await firstValueFrom(
        this.employeeService.employeeControllerDeleteEmployee(data.globalPersonID)
      );
      this.toastrService.success('Employee deleted successfully');
      await this.loadEmployees();
    } catch (error) {
      this.toastrService.error('Failed to delete employee');
      console.error(error);
    }

  }

  public columnDefs = EMPLOYEE_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  ngOnInit(): void {
    this.loadEmployees();
    this.setupColumnDefs();
  }

  async loadEmployees() {
    try {
      const employees = await firstValueFrom(
        this.employeeService.employeeControllerGetAllEmployees()
      );
      this.rowData.set(employees);
    } catch (error) {
      this.toastrService.error('Failed to load employees');
      console.error(error);
    }
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );
    await firstValueFrom(
      this.translocoService.selectTranslate(
        EMPLOYEE_COLUMNS_DEFS.map((x) => x.headerName ?? '')
      )
    );
    this.columnDefs = EMPLOYEE_COLUMNS_DEFS.map((col) => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: EmployeeModel) => this.onEdit(data),
            onDelete: (data: any) => this.onDelete(data),
            actionProfile: this.actions,
          },
        };
      }
      return { ...col, headerName: this.t(col.headerName ?? '') };
    });
  }

  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }
}
