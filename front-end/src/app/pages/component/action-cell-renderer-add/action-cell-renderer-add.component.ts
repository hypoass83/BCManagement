import { Component, OnInit } from '@angular/core';
import { ActionMenuProfileModel } from 'src/app/generated';
import SecurityProfileService from 'src/app/services/security/profile.service';

@Component({
  selector: 'app-action-cell-renderer',
  templateUrl: './action-cell-renderer-add.component.html',
})
export class ActionCellRendererAddComponent {
  params: any;
  delete = true;
  edit=true;

  agInit(params: any): void {
    this.params = params;
    this.delete = params.delete??true
    this.edit = params.edit??true
  }

  onDelete() {
    this.params.onDelete(this.params.node.id);
  }

  onEdit(){
    this.params.onEdit(this.params.data)
  }

}
