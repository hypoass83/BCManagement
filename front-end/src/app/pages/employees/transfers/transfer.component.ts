import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { TransferModel, TransferService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { TRANSFER_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/transfer';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {

  public rowData = signal<TransferModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public transferToEdit: TransferModel | null = null;

  constructor(
    private transferService: TransferService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createTransfer() {
    this.transferToEdit = null;
    openModal("transfer-create-form");
  }

  onEdit(data: TransferModel) {
    this.transferToEdit = data;
    openModal("transfer-create-form");
  }

  async onDelete(data: TransferModel) {


    try {
      await firstValueFrom(
        this.transferService.transferControllerDeleteTransfer(data.transferId ?? 0)
      );
      this.toastrService.success('Transfer deleted successfully', 'Success');
      await this.loadTransfers();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete transfer',
        'Error'
      );
    }
  }

  async loadTransfers() {
    try {
      const transfers = await firstValueFrom(
        this.transferService.transferControllerGetAllTransfers()
      );
      this.rowData.set(transfers);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load transfers',
        'Error'
      );
    }
  }

  public columnDefs = TRANSFER_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadTransfers();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        TRANSFER_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = TRANSFER_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: TransferModel) => this.onEdit(data),
            onDelete: (data: TransferModel) => this.onDelete(data),
            actionProfile: this.actions,
          }
        };
      }
      return { ...col, headerName: this.t(col.headerName ?? "") };
    });
  }

  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }
}
