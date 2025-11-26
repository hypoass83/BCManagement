import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
// Column Definition Type Interface
import { firstValueFrom } from 'rxjs';
import { JOB_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/job';

import { JobModel, JobService, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';


@Component({
  selector: 'app-jobs',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobsComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: JobModel[] = [];
  public gridApi!: GridApi;
  public actions: any;


  public quickFilterText = '';

  public jobToEdit: JobModel | null = null

  constructor(
    private jobService: JobService,
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
      this.rowData = await firstValueFrom(this.jobService.jobControllerGetAllJobs())

    } catch (error) {

    }
  }



  handleRowDataChange(updatedRowData: JobModel[]) {
    this.rowData = [];
    this.rowData = [...updatedRowData];
  }

  getCreateJob() {
    this.jobToEdit = null;
    openModal('job-create-form')

  }

  onEdit(data: JobModel) {
    this.jobToEdit = data;
    openModal('job-create-form')
  }

  async onDelete(data: JobModel) {

    try {
      const res = await firstValueFrom(this.jobService.jobControllerDeleteJob(data.jobID ?? 0));
      if (res) {
        this.rowData = this.rowData.filter(x => x.jobID != data.jobID);
      }
    } catch (error) {

    }

  }

  public columnDefs = JOB_COLUMNS_DEFS;

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
    await firstValueFrom(this.translocoService.selectTranslate(JOB_COLUMNS_DEFS.map(x => x.headerName ?? "")));
    this.columnDefs = JOB_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: JobModel) => this.onEdit(data),
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
