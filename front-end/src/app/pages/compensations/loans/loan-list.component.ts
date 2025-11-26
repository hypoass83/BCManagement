import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { LoanModel, LoanService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { LOAN_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/loan-columns-defs';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss'],
})
export class LoanListComponent implements OnInit {

  public rowData = signal<LoanModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public loanToEdit: LoanModel | null = null;
  public loanForPayment: LoanModel | null = null;

  // Filter state
  public activeFilter: 'all' | 'active' | 'paid' = 'all';

  constructor(
    private loanService: LoanService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createLoan() {
    this.loanToEdit = null;
    openModal("loan-create-form");
  }

  onEdit(data: LoanModel) {
    this.loanToEdit = data;
    openModal("loan-create-form");
  }

  onAddPayment(data: LoanModel) {
    this.loanForPayment = data;
    openModal("loan-payment-form");
  }

  async onDelete(data: LoanModel) {
    
    try {
      await firstValueFrom(
        this.loanService.loanControllerDeleteLoan(data.loanId ?? 0)
      );
      this.toastrService.success('Loan deleted successfully', 'Success');
      await this.loadLoans();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete loan',
        'Error'
      );
    }
  }

  async loadLoans() {
    try {
      let loans: LoanModel[] = [];

      switch (this.activeFilter) {
        case 'all':
          loans = await firstValueFrom(
            this.loanService.loanControllerGetAllLoans()
          );
          break;
        case 'active':
          loans = await firstValueFrom(
            this.loanService.loanControllerGetAllActiveLoans()
          );
          break;
        case 'paid':
          const allLoans = await firstValueFrom(
            this.loanService.loanControllerGetAllLoans()
          );
          loans = allLoans.filter(loan => loan.status === 1); // Soldé
          break;
      }

      this.rowData.set(loans);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load loans',
        'Error'
      );
    }
  }

  async onFilterChange(filter: 'all' | 'active' | 'paid') {
    this.activeFilter = filter;
    await this.loadLoans();
  }

  public columnDefs = LOAN_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadLoans();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        LOAN_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = LOAN_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: LoanModel) => this.onEdit(data),
            onDelete: (data: LoanModel) => this.onDelete(data),
            onAddPayment: (data: LoanModel) => this.onAddPayment(data),
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
