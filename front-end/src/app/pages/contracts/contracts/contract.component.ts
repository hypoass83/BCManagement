// contract.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { ContractModel, EmployeeService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { CONTRACT_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/contract-columns-defs';

@Component({
  selector: 'app-contracts',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractsComponent implements OnInit {
  public rowData = signal<ContractModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public contractToEdit: ContractModel | null = null;
  public selectedEmployeeId: number | null = null;

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

  createContract() {
    this.contractToEdit = null;
    this.selectedEmployeeId = null;
    openModal('contract-create-form');
  }

  onEdit(data: ContractModel) {
    this.contractToEdit = data;
    this.selectedEmployeeId = data.employeeId ?? null;
    openModal('contract-create-form');
  }

  async onRenew(data: ContractModel) {
    // Cette fonctionnalité sera gérée dans un autre modal
    this.toastrService.info('Renew contract feature - to be implemented');
  }

  async onTerminate(data: ContractModel) {

    try {
      await firstValueFrom(
        this.employeeService.employeeControllerTerminateContract(
          data.employeeId!,
          data.contractId!,
          {
            terminationDate: new Date().toISOString().split('T')[0],
            terminationReason: 'Manual termination'
          }
        )
      );
      this.toastrService.success('Contract terminated successfully');
      await this.loadContracts();
    } catch (error) {
      this.toastrService.error('Failed to terminate contract');
      console.error(error);
    }

  }

  public columnDefs = CONTRACT_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  ngOnInit(): void {
    this.loadContracts();
    this.setupColumnDefs();
  }

  async loadContracts() {
    try {

      const allContracts = await firstValueFrom(
        this.employeeService.employeeControllerGetAllActiveContracts()
      );

      this.rowData.set(allContracts);
    } catch (error) {
      this.toastrService.error('Failed to load contracts');
      console.error(error);
    }
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );
    await firstValueFrom(
      this.translocoService.selectTranslate(
        CONTRACT_COLUMNS_DEFS.map((x) => x.headerName ?? '')
      )
    );
    this.columnDefs = CONTRACT_COLUMNS_DEFS.map((col) => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: ContractModel) => this.onEdit(data),
            onRenew: (data: ContractModel) => this.onRenew(data),
            onTerminate: (data: ContractModel) => this.onTerminate(data),
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
