import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
 // Column Definition Type Interface
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { BRANCH_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/branch';

import { BranchModel, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { BranchManagerService } from 'src/app/services/security/branch.service';



@Component({
  selector: 'app-branchs',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss'],
})
export class BranchsComponent implements OnInit {

  public rowData= this.branchService.branchList
  public gridApi!: GridApi;

  public quickFilterText = '';
  public actions: any;

  public BranchToEdit: BranchModel | null = null

  constructor(
    private branchService: BranchManagerService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme:AgGridThemeService
  ) {

  }


  onGridReady(params: any) {
    this.gridApi = params.api;
  }


  createBranch() {
    this.BranchToEdit = null;
    openModal("branch-create-form")
  }

  onEdit(data: BranchModel) {
    this.BranchToEdit = data;
    openModal("branch-create-form")
  }

  async onDelete(data: BranchModel) {
    this.branchService.deleteBranch(data.branchID ?? 0);
  }

  public columnDefs = BRANCH_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };


  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean =[10, 25, 50]; // [10, 25, 50];
 public themeClass = this.theme.theme;



  ngOnInit(): void {

    this.setupColumnDefs()
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(this.profileService.profileControllerGetActionByPath(window.location.pathname))
    await firstValueFrom(this.translocoService.selectTranslate(BRANCH_COLUMNS_DEFS.map(x => x.headerName ?? "")));
    this.columnDefs = BRANCH_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
      ...col.cellRendererParams,
            onEdit: (data: BranchModel) => this.onEdit(data),
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
