import { Component, OnInit } from '@angular/core';

import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';

import SecurityProfileService from 'src/app/services/security/profile.service';
import { PROFILE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/profile';
import { ActionMenuProfileModel } from 'src/app/generated';
import SecurityModuleService from 'src/app/services/security/module.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileListComponent implements OnInit{
  constructor(private profileService: SecurityProfileService,
    private moduleService:SecurityModuleService,
    private theme:AgGridThemeService,
    private route:Router
  ) {}
  gridApi!: GridApi

  profileID = 0;

  public rowData= this.profileService.profileList;
  quickFilterText = '';
  public columnDefs: ColDef[] = PROFILE_COLUMNS_DEFS;

  actionProfile:ActionMenuProfileModel|undefined

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    flex:1,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean =[10, 25, 50]; // [10, 25, 50];
  public themeClass=this.theme.theme

   ngOnInit() {

    this.profileService.getActionProfileByPath(window.location.pathname).subscribe(action=>{
      this.actionProfile = action
      if(this.actionProfile.update ){
        this.columnDefs = this.columnDefs.map(col => {
          if (col.field === 'actions') {
            return {
              ...col,
              cellRendererParams: {
      ...col.cellRendererParams,
                onDelete: (data: any) => this.onDelete(data),
                actionProfile:this.actionProfile,
                onEdit:(data:any)=> this.route.navigate(["/admin/profile-form/"+data.profileID])
              }
            };
          }
          return col;
        });
      }else{
        this.columnDefs = this.columnDefs.filter(e=>e.field!="actions")
      }
    })


    this.profileService.getProfileList();
    this.moduleService.updateAllModule();
  }

  onDelete(data: any) {
    const id =data
    this.profileService.deleteProfile(id)

  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
