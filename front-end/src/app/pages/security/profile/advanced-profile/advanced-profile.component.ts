
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
 // Column Definition Type Interface
import SecurityProfileService from 'src/app/services/security/profile.service';
import { ADVANCED_PROFILE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/profile';
import { Component, OnInit } from '@angular/core';
import { ActionMenuProfileModel } from 'src/app/generated';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advanced-profile',
  templateUrl: './advanced-profile.component.html',
  styleUrls: ['./advanced-profile.component.scss']
})
export class AdvancedProfileComponent implements OnInit{
  constructor(private profileService: SecurityProfileService,private route:Router,private theme:AgGridThemeService) {}
   gridApi!: GridApi;
  actionProfile :ActionMenuProfileModel|undefined

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  profileID = 0;

  public rowData = this.profileService.profileList;
  quickFilterText = '';
  public columnDefs: ColDef[] = ADVANCED_PROFILE_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  };

  public rowSelection: 'single' | 'multiple' = 'multiple';
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean =[10, 25, 50]; // [10, 25, 50];
  public themeClass=this.theme.theme

  ngOnInit() {
    this.profileService.getActionProfileByPath(window.location.pathname).subscribe(action=>{
      this.actionProfile = action
      this.actionProfile.remove=false
      if(this.actionProfile.update ){
        this.columnDefs = this.columnDefs.map(col => {
          if (col.field === 'actions') {
            return {
              ...col,
              cellRendererParams: {
      ...col.cellRendererParams,
                actionProfile:this.actionProfile,
                onEdit:(data:any)=> this.route.navigate(["/admin/profile/advanced/edit/"+data.profileID])
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
  }
}
