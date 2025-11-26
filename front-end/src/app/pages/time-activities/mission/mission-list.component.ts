import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { MissionModel, MissionService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { MISSION_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/mission-columns-defs';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.scss'],
})
export class MissionListComponent implements OnInit {

  public rowData = signal<MissionModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public missionToEdit: MissionModel | null = null;

  // Filter state
  public activeFilter: 'all' | 'planned' | 'active' | 'completed' = 'all';

  constructor(
    private missionService: MissionService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createMission() {
    this.missionToEdit = null;
    openModal("mission-create-form");
  }

  onEdit(data: MissionModel) {
    this.missionToEdit = data;
    openModal("mission-create-form");
  }

  async onDelete(data: MissionModel) {
    

    try {
      await firstValueFrom(
        this.missionService.missionControllerDeleteMission(data.missionId ?? 0)
      );
      this.toastrService.success('Mission deleted successfully', 'Success');
      await this.loadMissions();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete mission',
        'Error'
      );
    }
  }

  async loadMissions() {
    try {
      let missions: MissionModel[] = [];

      switch (this.activeFilter) {
        case 'all':
          missions = await firstValueFrom(
            this.missionService.missionControllerGetAllMissions()
          );
          break;
        case 'planned':
          missions = await firstValueFrom(
            this.missionService.missionControllerGetMissionsByStatus(0) // Planifiée
          );
          break;
        case 'active':
          missions = await firstValueFrom(
            this.missionService.missionControllerGetActiveMissions()
          );
          break;
        case 'completed':
          missions = await firstValueFrom(
            this.missionService.missionControllerGetCompletedMissions()
          );
          break;
      }

      this.rowData.set(missions);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load missions',
        'Error'
      );
    }
  }

  async onFilterChange(filter: 'all' | 'planned' | 'active' | 'completed') {
    this.activeFilter = filter;
    await this.loadMissions();
  }

  public columnDefs = MISSION_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadMissions();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        MISSION_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = MISSION_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: MissionModel) => this.onEdit(data),
            onDelete: (data: MissionModel) => this.onDelete(data),
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