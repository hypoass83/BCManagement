import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { SanctionModel, SanctionService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { SANCTION_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/sanction-columns-defs';

@Component({
  selector: 'app-sanction-list',
  templateUrl: './sanction-list.component.html',
  styleUrls: ['./sanction-list.component.scss'],
})
export class SanctionListComponent implements OnInit {

  public rowData = signal<SanctionModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public sanctionToEdit: SanctionModel | null = null;

  // Filter state
  public activeFilter: 'all' | 'avertissement' | 'blame' | 'misepied' | 'reduction' | 'licenciement' = 'all';

  constructor(
    private sanctionService: SanctionService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createSanction() {
    this.sanctionToEdit = null;
    openModal("sanction-create-form");
  }

  onEdit(data: SanctionModel) {
    this.sanctionToEdit = data;
    openModal("sanction-create-form");
  }

  async onDelete(data: SanctionModel) {
    if (!confirm('Are you sure you want to delete this sanction?')) {
      return;
    }

    try {
      await firstValueFrom(
        this.sanctionService.sanctionControllerDeleteSanction(data.sanctionId ?? 0)
      );
      this.toastrService.success('Sanction deleted successfully', 'Success');
      await this.loadSanctions();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete sanction',
        'Error'
      );
    }
  }

  async loadSanctions() {
    try {
      let sanctions: SanctionModel[] = [];

      switch (this.activeFilter) {
        case 'all':
          sanctions = await firstValueFrom(
            this.sanctionService.sanctionControllerGetAllSanctions()
          );
          break;
        case 'avertissement':
          sanctions = await firstValueFrom(
            this.sanctionService.sanctionControllerGetSanctionsByType(0)
          );
          break;
        case 'blame':
          sanctions = await firstValueFrom(
            this.sanctionService.sanctionControllerGetSanctionsByType(1)
          );
          break;
        case 'misepied':
          sanctions = await firstValueFrom(
            this.sanctionService.sanctionControllerGetSanctionsByType(2)
          );
          break;
        case 'reduction':
          sanctions = await firstValueFrom(
            this.sanctionService.sanctionControllerGetSanctionsByType(3)
          );
          break;
        case 'licenciement':
          sanctions = await firstValueFrom(
            this.sanctionService.sanctionControllerGetSanctionsByType(4)
          );
          break;
      }

      this.rowData.set(sanctions);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load sanctions',
        'Error'
      );
    }
  }

  async onFilterChange(filter: 'all' | 'avertissement' | 'blame' | 'misepied' | 'reduction' | 'licenciement') {
    this.activeFilter = filter;
    await this.loadSanctions();
  }

  public columnDefs = SANCTION_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadSanctions();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        SANCTION_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = SANCTION_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: SanctionModel) => this.onEdit(data),
            onDelete: (data: SanctionModel) => this.onDelete(data),
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
