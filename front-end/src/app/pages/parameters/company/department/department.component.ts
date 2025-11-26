import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
// Column Definition Type Interface
import { firstValueFrom } from 'rxjs';


import { DepartmentModel, DepartmentService, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { DEPARTMENT_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/departement';


@Component({
  selector: 'app-departments',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})


export class DepartmentsComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: DepartmentModel[] = [];
  public gridApi!: GridApi;
  public actions: any;


  public quickFilterText = '';

  public departmentToEdit: DepartmentModel | null = null

  constructor(
    private DepartmentService: DepartmentService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService,

  ) {

  }


  onGridReady(params: any) {
    this.gridApi = params.api;

    this.translocoService.langChanges$.subscribe(() => {
      this.gridApi.refreshHeader();
    });
    params.api.sizeColumnsToFit();

  }

  async getData() {
    this.rowData = await firstValueFrom(this.DepartmentService.departmentControllerGetAllDepartments())
  }



  handleRowDataChange(updatedRowData: DepartmentModel[]) {
    this.rowData = [];
    this.rowData = [...updatedRowData];
  }

  getCreateDepartment() {
    this.departmentToEdit = null;
    openModal('departement-create-form')

  }

  onEdit(data: DepartmentModel) {
    this.departmentToEdit = data;
    openModal('departement-create-form')
  }

  async onDelete(data: DepartmentModel) {

    try {
      const res = await firstValueFrom(this.DepartmentService.departmentControllerDeleteDepartment(data.departmentID ?? 0));
      this.getData();
    } catch (error) {

    }

  }

  public columnDefs = DEPARTMENT_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
    flex: 1,
  };


  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50]; // [10, 25, 50];
  public themeClass = this.theme.theme;



  async ngOnInit() {
    this.getData()

    this.actions = await firstValueFrom(this.profileService.profileControllerGetActionByPath(window.location.pathname));

    this.translocoService.langChanges$.subscribe(() => {
      this.setupColumnDefs();
    });
  }

  async setupColumnDefs() {
    await firstValueFrom(this.translocoService.selectTranslate(this.columnDefs.map(x => x.headerName ?? "")));
    this.columnDefs = this.columnDefs.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: DepartmentModel) => this.onEdit(data),
            onDelete: (data: any) => this.onDelete(data),
            actionProfile: this.actions,
          }
        };
      }
      return { ...col, headerName: this.t(col.headerName ?? "") };
    })

  }


  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }

}
