import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
// Column Definition Type Interface
import { firstValueFrom } from 'rxjs';


import { DegreeModel, DegreeService, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { DEGREE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/degree';


@Component({
  selector: 'app-degrees',
  templateUrl: './degree.component.html',
  styleUrls: ['./degree.component.scss'],
})
export class DegreesComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: DegreeModel[] = [];
  public gridApi!: GridApi;
  public actions: any;


  public quickFilterText = '';

  public degreeToEdit: DegreeModel | null = null

  constructor(
    private DegreeService: DegreeService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService,

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
      this.rowData = await firstValueFrom(this.DegreeService.degreeControllerGetAllDegrees())

    } catch (error) {

    }
  }



  handleRowDataChange(updatedRowData: DegreeModel[]) {
    this.rowData = [];
    this.rowData = [...updatedRowData];
  }

  getCreateDegree() {
    this.degreeToEdit = null;
    openModal('Degree-create-form')

  }

  onEdit(data: DegreeModel) {
    this.degreeToEdit = data;
    openModal('Degree-create-form')
  }

  async onDelete(data: DegreeModel) {


    const res = await firstValueFrom(this.DegreeService.degreeControllerDeleteDegree(data.degreeID ?? 0));
    this.getData();

  }

  public columnDefs = DEGREE_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
    flex: 1,
  };


  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50]; // [10, 25, 50];
  public themeClass = this.theme.theme;



  async ngOnInit() {
    this.getData()

    this.actions = await firstValueFrom(this.profileService.profileControllerGetActionByPath(window.location.pathname));

    this.translocoService.langChanges$.subscribe(() => {
      this.setupColumnDefs();
    });
  }

  async setupColumnDefs() {
    await firstValueFrom(this.translocoService.selectTranslate(this.columnDefs.map(x => x.headerName ?? "")));
    this.columnDefs = this.columnDefs.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: DegreeModel) => this.onEdit(data),
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
