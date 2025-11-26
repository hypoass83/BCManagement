import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
// Column Definition Type Interface
import { firstValueFrom } from 'rxjs';


import { LeaveTypeModel, LeaveTypeService, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { LEAVE_TYPE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/degree copy';


@Component({
  selector: 'app-leaves',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
})
export class LeaveTypesComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: LeaveTypeModel[] = [];
  public gridApi!: GridApi;
  public actions: any;


  public quickFilterText = '';

  public leaveTypeToEdit: LeaveTypeModel | null = null

  constructor(
    private LeaveTypeService: LeaveTypeService,
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
      this.rowData = await firstValueFrom(this.LeaveTypeService.leaveTypeControllerGetAllLeaveTypes())

    } catch (error) {

    }
  }



  handleRowDataChange(updatedRowData: LeaveTypeModel[]) {
    this.rowData = [];
    this.rowData = [...updatedRowData];
  }

  getCreateLeaveType() {
    this.leaveTypeToEdit = null;
    openModal('leave-type-create-form')

  }

  onEdit(data: LeaveTypeModel) {
    this.leaveTypeToEdit = data;
    openModal('leave-type-create-form')
  }

  async onDelete(data: LeaveTypeModel) {


    const res = await firstValueFrom(this.LeaveTypeService.leaveTypeControllerDeleteLeaveType(data.leaveTypeID ?? 0));
    this.getData();

  }

  public columnDefs = LEAVE_TYPE_COLUMNS_DEFS;

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
            onEdit: (data: LeaveTypeModel) => this.onEdit(data),
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
