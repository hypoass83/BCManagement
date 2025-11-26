// contract-type-list.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ContractTypeModel, ContractTypeService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { CONTRACT_TYPE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/contract-type';

@Component({
  selector: 'app-contract-type-list',
  templateUrl: './contract-type-list.component.html'
})
export class ContractTypeListComponent implements OnInit {

  public rowData = signal<ContractTypeModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public contractTypeToEdit: ContractTypeModel | null = null;

  constructor(
    private contractTypeService: ContractTypeService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createContractType() {
    this.contractTypeToEdit = null;
    openModal("contract-type-form");
  }

  onEdit(data: ContractTypeModel) {
    this.contractTypeToEdit = data;
    openModal("contract-type-form");
  }

  async onDelete(data: ContractTypeModel) {
    if (!confirm('Are you sure you want to delete this contract type?')) {
      return;
    }

    try {
      await firstValueFrom(
        this.contractTypeService.contractTypeControllerDeleteContractType(data.contractTypeID ?? 0)
      );
      this.toastrService.success('Contract type deleted successfully', 'Success');
      await this.loadContractTypes();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete contract type',
        'Error'
      );
    }
  }

  async loadContractTypes() {
    try {
      const contractTypes = await firstValueFrom(
        this.contractTypeService.contractTypeControllerGetAllContractTypes()
      );
      this.rowData.set(contractTypes);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load contract types',
        'Error'
      );
    }
  }

  public columnDefs = CONTRACT_TYPE_COLUMNS_DEFS;
  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };
  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadContractTypes();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    this.columnDefs = CONTRACT_TYPE_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: ContractTypeModel) => this.onEdit(data),
            onDelete: (data: ContractTypeModel) => this.onDelete(data),
            actionProfile: this.actions,
          }
        };
      }
      return col;
    });
  }

  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }
}
