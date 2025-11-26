import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
 // Column Definition Type Interface
import { firstValueFrom } from 'rxjs';
import { TOWN_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/town';

import { TownModel, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';


@Component({
  selector: 'app-towns',
  templateUrl: './town.component.html',
  styleUrls: ['./town.component.scss'],
})
export class TownsComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: TownModel[] = [];
  public gridApi!: GridApi;
  public actions: any;


  public quickFilterText = '';

  public townToEdit: TownModel | null = null

  constructor(
    private localisationService: LocalisationService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme:AgGridThemeService,
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

    try {
      this.rowData = await firstValueFrom(this.localisationService.localisationControllerGetAllTowns())

    } catch (error) {

    }
  }



  handleRowDataChange(updatedRowData: TownModel[]) {
    this.rowData = [];
    this.rowData = [...updatedRowData];
  }

  getCreateTown() {
    this.townToEdit = null;
    openModal('town-create-form');
  }

  onEdit(data: TownModel) {
    this.townToEdit = data;
    openModal('town-create-form');
  }

  async onDelete(data: TownModel) {

    try {
      const res = await firstValueFrom(this.localisationService.localisationControllerDeleteTown(data.townID ?? 0));
      if (res) {
        this.rowData = this.rowData.filter(x => x.townID != data.townID);
      }
    } catch (error) {

    }

  }

  public columnDefs = TOWN_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
    flex: 1,
  };


  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean =[10, 25, 50]; // [10, 25, 50];
 public themeClass = this.theme.theme;



  async ngOnInit() {
    this.getData()

    this.actions = await firstValueFrom(this.profileService.profileControllerGetActionByPath(window.location.pathname));

    this.translocoService.langChanges$.subscribe(() => {
      this.setupColumnDefs();
    });
  }

  async setupColumnDefs() {

    await firstValueFrom(this.translocoService.selectTranslate(TOWN_COLUMNS_DEFS.map(x => x.headerName ?? "")));
    this.columnDefs = TOWN_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
      ...col.cellRendererParams,
            onEdit: (data: TownModel) => this.onEdit(data),
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
