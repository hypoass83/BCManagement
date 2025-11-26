import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';


import { CompanyModel, CompanyService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { COMPANY_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/company-columns-defs';

@Component({
  selector: 'app-companies',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
})
export class CompaniesComponent implements OnInit {

  public rowData = signal<CompanyModel[]>([]);
  public gridApi!: GridApi;

  public quickFilterText = '';
  public actions: any;

  public companyToEdit: CompanyModel | null = null;

  constructor(
    private companyService: CompanyService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) {}

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createCompany() {
    this.companyToEdit = null;
    openModal("company-create-form");
  }

  onEdit(data: CompanyModel) {
    this.companyToEdit = data;
    openModal("company-create-form");
  }

  async onDelete(data: CompanyModel) {


    try {
      await firstValueFrom(
        this.companyService.companyControllerDeleteCompany(data.companyID)
      );

      await this.loadCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      this.toastrService.error('Failed to delete company', 'Error');
    }
  }

  async loadCompanies() {
    try {
      const companies = await firstValueFrom(
        this.companyService.companyControllerGetAllCompanies()
      );
      this.rowData.set(companies);
    } catch (error) {
      console.error('Error loading companies:', error);
      this.toastrService.error('Failed to load companies', 'Error');
    }
  }

  onCompanyUpdated() {
    this.loadCompanies();
  }

  public columnDefs = COMPANY_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  ngOnInit(): void {
    this.loadCompanies();
    this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );
    await firstValueFrom(
      this.translocoService.selectTranslate(COMPANY_COLUMNS_DEFS.map(x => x.headerName ?? ""))
    );
    this.columnDefs = COMPANY_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: CompanyModel) => this.onEdit(data),
            onDelete: (data: any) => this.onDelete(data),
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
