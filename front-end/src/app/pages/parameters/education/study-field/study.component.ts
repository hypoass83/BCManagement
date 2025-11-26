import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
// Column Definition Type Interface
import { firstValueFrom } from 'rxjs';

import { StudyFieldModel, StudyFieldService, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { DEGREE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/degree';
import { STUDY_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/study';


@Component({
  selector: 'app-studys',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
})
export class StudyFieldsComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: StudyFieldModel[] = [];
  public gridApi!: GridApi;
  public actions: any;


  public quickFilterText = '';

  public studyFieldToEdit: StudyFieldModel | null = null

  constructor(
    private StudyFieldService: StudyFieldService,
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
      this.rowData = await firstValueFrom(this.StudyFieldService.studyFieldControllerGetAllStudyFields())

    } catch (error) {

    }
  }



  handleRowDataChange(updatedRowData: StudyFieldModel[]) {
    this.rowData = [];
    this.rowData = [...updatedRowData];
  }

  getCreateStudyField() {
    this.studyFieldToEdit = null;
    openModal('field-create-form')

  }

  onEdit(data: StudyFieldModel) {
    this.studyFieldToEdit = data;
    openModal('field-create-form')
  }

  async onDelete(data: StudyFieldModel) {

    try {
      const res = await firstValueFrom(this.StudyFieldService.studyFieldControllerDeleteStudyField(data.studyFieldID ?? 0));
      this.getData();
    } catch (error) {

    }

  }

  public columnDefs = STUDY_COLUMNS_DEFS;

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
            onEdit: (data: StudyFieldModel) => this.onEdit(data),
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
