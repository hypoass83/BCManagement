import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
 // Column Definition Type Interface
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { COUNTRY_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/country';

import { ActionSubMenuProfileModel, CountryModel, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';


@Component({
  selector: 'app-countries',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountriesComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: CountryModel[] = [];
  public gridApi!: GridApi;

  public quickFilterText = '';

  public countryToEdit: CountryModel | null = null

  constructor(
    private localisationService: LocalisationService,
    private toastrService: ToastrService,
    private profileService:ProfileService,
    private theme:AgGridThemeService
  ) {

  }

  action!:ActionSubMenuProfileModel
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  async getData() {

    try {
      this.rowData = await firstValueFrom(this.localisationService.localisationControllerGetAllCountrys())

    } catch (error) {

    }

  }

  handleRowDataChange(updatedRowData: CountryModel[]) {
    this.rowData =[];
    this.rowData = [...updatedRowData];
  }

  getCreateCountry() {
    this.countryToEdit = null;
    openModal("country-create-form")
  }

  onEdit(data: CountryModel) {
    this.countryToEdit = data;
    openModal("country-create-form")
  }

  async onDelete(data: CountryModel) {

    try {
      const res = await firstValueFrom(this.localisationService.localisationControllerDeleteCountry(data.countryID ?? 0));
      if (res) {
        this.rowData = this.rowData.filter(x => x.countryID != data.countryID);
      }
    } catch (error) {

    }

  }

  public columnDefs = COUNTRY_COLUMNS_DEFS;

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
    this.action = await firstValueFrom(this.profileService.profileControllerGetActionByPath(window.location.pathname))
    this.columnDefs = COUNTRY_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        // Assign the action handlers
        return {
          ...col,
          cellRendererParams: {
      ...col.cellRendererParams,
            onEdit: (data: CountryModel) => this.onEdit(data),
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
