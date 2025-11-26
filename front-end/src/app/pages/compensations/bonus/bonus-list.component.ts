import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { BonusModel, BonusService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { BONUS_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/bonus-columns-defs';

@Component({
  selector: 'app-bonus-list',
  templateUrl: './bonus-list.component.html',
  styleUrls: ['./bonus-list.component.scss'],
})
export class BonusListComponent implements OnInit {

  public rowData = signal<BonusModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public bonusToEdit: BonusModel | null = null;

  // Filter state
  public activeFilter: 'all' | 'individual' | 'collective' = 'all';

  constructor(
    private bonusService: BonusService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createBonus() {
    this.bonusToEdit = null;
    openModal("bonus-create-form");
  }

  onEdit(data: BonusModel) {
    this.bonusToEdit = data;
    openModal("bonus-create-form");
  }

  async onDelete(data: BonusModel) {


    try {
      await firstValueFrom(
        this.bonusService.bonusControllerDeleteBonus(data.bonusId ?? 0)
      );
      this.toastrService.success('Bonus deleted successfully', 'Success');
      await this.loadBonuses();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete bonus',
        'Error'
      );
    }
  }

  async loadBonuses() {
    try {
      let bonuses: BonusModel[] = [];

      switch (this.activeFilter) {
        case 'all':
          bonuses = await firstValueFrom(
            this.bonusService.bonusControllerGetAllBonuses()
          );
          break;
        case 'individual':
          bonuses = await firstValueFrom(
            this.bonusService.bonusControllerGetAllIndividualBonuses()
          );
          break;
        case 'collective':
          bonuses = await firstValueFrom(
            this.bonusService.bonusControllerGetAllCollectiveBonuses()
          );
          break;
      }

      this.rowData.set(bonuses);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load bonuses',
        'Error'
      );
    }
  }

  async onFilterChange(filter: 'all' | 'individual' | 'collective') {
    this.activeFilter = filter;
    await this.loadBonuses();
  }

  public columnDefs = BONUS_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadBonuses();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        BONUS_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = BONUS_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: BonusModel) => this.onEdit(data),
            onDelete: (data: BonusModel) => this.onDelete(data),
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
