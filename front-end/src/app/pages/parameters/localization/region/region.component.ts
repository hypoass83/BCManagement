import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
 // Column Definition Type Interface
import { firstValueFrom } from 'rxjs';
import { REGION_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/region';

import { RegionModel, LocalisationService, ProfileService, ActionSubMenuProfileModel, ActionMenuProfileModel } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';


@Component({
  selector: 'app-regions',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss'],
})
export class RegionsComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: RegionModel[] = [];
  public gridApi!: GridApi;

  public quickFilterText = '';

  public regionToEdit: RegionModel | null = null

  constructor(
    private localisationService: LocalisationService,
    private profileService:ProfileService,
    private theme:AgGridThemeService
  ) {

  }


  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  async getData() {

    try {
      this.rowData = await firstValueFrom(this.localisationService.localisationControllerGetAllRegions())

    } catch (error) {

    }

  }



  handleRowDataChange(updatedRowData: RegionModel[]) {
    this.rowData =[];
    this.rowData = [...updatedRowData];
  }

  getCreateRegion() {
    this.regionToEdit = null;
    openModal('region-create-form');
  }

  onEdit(data: RegionModel) {
    this.regionToEdit = data;
    openModal('region-create-form');
  }

  async onDelete(data: RegionModel) {

    try {
      const res = await firstValueFrom(this.localisationService.localisationControllerDeleteRegion(data.regionID ?? 0));
      if (res) {
        this.rowData = this.rowData.filter(x => x.regionID != data.regionID);
      }
    } catch (error) {

    }

  }

  public columnDefs = REGION_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
    flex: 1,
  };


  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean =[10, 25, 50]; // [10, 25, 50];
 public themeClass = this.theme.theme;


  action!:ActionMenuProfileModel
async  ngOnInit() {
    this.action = await firstValueFrom(this.profileService.profileControllerGetActionByPath(window.location.pathname))

    this.columnDefs = REGION_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        // Assign the action handlers
        return {
          ...col,
          cellRendererParams: {
      ...col.cellRendererParams,
            onEdit: (data: RegionModel) => this.onEdit(data),
            onDelete: (data: any) => this.onDelete(data),
            actionProfile:this.action
          }
        };
      }
      return col;
    });
    this.getData()

  }


}
