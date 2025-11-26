import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
 // Column Definition Type Interface
import { firstValueFrom } from 'rxjs';
import { QUARTER_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/quarter';


import { QuarterModel, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';


@Component({
  selector: 'app-quarters',
  templateUrl: './quarter.component.html',
  styleUrls: ['./quarter.component.scss'],
})
export class QuartersComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: QuarterModel[] = [];
  public gridApi!: GridApi;
  public actions: any;


  public quickFilterText = '';

  public quarterToEdit: QuarterModel | null = null

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
      this.rowData = await firstValueFrom(this.localisationService.localisationControllerGetAllQuarters())

    } catch (error) {

    }
  }



  handleRowDataChange(updatedRowData: QuarterModel[]) {
    this.rowData = [];
    this.rowData = [...updatedRowData];
  }

  getCreateQuarter() {
    this.quarterToEdit = null;
    openModal("quarter-create-form")
  }

  onEdit(data: QuarterModel) {
    this.quarterToEdit = data;
    openModal("quarter-create-form")
  }

  async onDelete(data: QuarterModel) {

    try {
      const res = await firstValueFrom(this.localisationService.localisationControllerDeleteQuarter(data.quarterID ?? 0));
      if (res) {
        this.rowData = this.rowData.filter(x => x.quarterID != data.quarterID);
      }
    } catch (error) {

    }

  }

  public columnDefs = QUARTER_COLUMNS_DEFS;

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

    await firstValueFrom(this.translocoService.selectTranslate(QUARTER_COLUMNS_DEFS.map(x => x.headerName ?? "")));
    this.columnDefs = QUARTER_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
      ...col.cellRendererParams,
            onEdit: (data: QuarterModel) => this.onEdit(data),
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
