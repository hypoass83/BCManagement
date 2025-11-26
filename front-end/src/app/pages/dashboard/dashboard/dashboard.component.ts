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
  selector: 'app-dashboards',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

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




  async ngOnInit() {



  }



  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }


}
