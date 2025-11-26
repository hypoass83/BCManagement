import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
// Column Definition Type Interface
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { USER_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/user';
import { ProfileService, UserModel } from 'src/app/generated';
import { closeModal, openModal } from 'src/app/helper/helper-function';
import { UserManagerService } from 'src/app/services/security/user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  public rowData: UserModel[] = [];
  public gridApi!: GridApi;

  public quickFilterText = '';

  public actions: any;

  public userToEdit: UserModel | null = null

  constructor(
    private userService: UserManagerService,
    private toastrService: ToastrService,
    private profileService: ProfileService,
    private theme: AgGridThemeService,
    private translocoService: TranslocoService
  ) {


  }

  onGridReady(params: any) {
    this.gridApi = params.api;

    this.translocoService.langChanges$.subscribe(() => {
      this.gridApi.refreshHeader();
    });
    params.api.sizeColumnsToFit();

  }

  async getData(): Promise<void> {
    this.userService.userListSubject.subscribe({
      next: (val) => { this.rowData = val },
      error: (err) => { this.toastrService.error(err.error.message) },
      complete: () => { }
    })

    this.userService.refreshUserList();
  }

  createuser() {
    this.userToEdit = null;
    openModal("user-create-form")
  }

  onEdit(data: UserModel) {
    this.userToEdit = data;
    openModal("user-create-form")
  }

  async onDelete(data: UserModel) {
    this.userService.deleteUser(data.globalPersonID ?? 0);
  }

  public columnDefs = USER_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
    resizable: true,
    sortable: true,
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

    await firstValueFrom(this.translocoService.selectTranslate(USER_COLUMNS_DEFS.map(x => x.headerName ?? "")));
    this.columnDefs = USER_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: UserModel) => this.onEdit(data),
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
