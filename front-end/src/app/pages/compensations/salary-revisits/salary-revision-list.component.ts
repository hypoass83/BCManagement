import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { SalaryRevisionModel, SalaryRevisionService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { SALARY_REVISION_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/salary-revision-columns-defs';

@Component({
  selector: 'app-salary-revision-list',
  templateUrl: './salary-revision-list.component.html',
  styleUrls: ['./salary-revision-list.component.scss'],
})
export class SalaryRevisionListComponent implements OnInit {

  public rowData = signal<SalaryRevisionModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public revisionToEdit: SalaryRevisionModel | null = null;

  // Filter state
  public activeFilter: 'all' | 'individual' | 'collective' = 'all';

  constructor(
    private salaryRevisionService: SalaryRevisionService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createRevision() {
    this.revisionToEdit = null;
    openModal("salary-revision-create-form");
  }

  onEdit(data: SalaryRevisionModel) {
    this.revisionToEdit = data;
    openModal("salary-revision-create-form");
  }

  async onDelete(data: SalaryRevisionModel) {

    try {
      await firstValueFrom(
        this.salaryRevisionService.salaryRevisionControllerDeleteSalaryRevision(data.salaryRevisionId ?? 0)
      );
      this.toastrService.success('Salary revision deleted successfully', 'Success');
      await this.loadRevisions();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete salary revision',
        'Error'
      );
    }
  }

  async loadRevisions() {
    try {
      let revisions: SalaryRevisionModel[] = [];

      switch (this.activeFilter) {
        case 'all':
          revisions = await firstValueFrom(
            this.salaryRevisionService.salaryRevisionControllerGetAllSalaryRevisions()
          );
          break;
        case 'individual':
          revisions = await firstValueFrom(
            this.salaryRevisionService.salaryRevisionControllerGetAllIndividualRevisions()
          );
          break;
        case 'collective':
          revisions = await firstValueFrom(
            this.salaryRevisionService.salaryRevisionControllerGetAllCollectiveRevisions()
          );
          break;
      }

      this.rowData.set(revisions);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load salary revisions',
        'Error'
      );
    }
  }

  async onFilterChange(filter: 'all' | 'individual' | 'collective') {
    this.activeFilter = filter;
    await this.loadRevisions();
  }

  public columnDefs = SALARY_REVISION_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadRevisions();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        SALARY_REVISION_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = SALARY_REVISION_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: SalaryRevisionModel) => this.onEdit(data),
            onDelete: (data: SalaryRevisionModel) => this.onDelete(data),
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
