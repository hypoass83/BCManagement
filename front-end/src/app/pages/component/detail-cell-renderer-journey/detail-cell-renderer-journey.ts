import { Component, OnInit } from '@angular/core';
import { ActionMenuProfileModel } from 'src/app/generated';
import SecurityProfileService from 'src/app/services/security/profile.service';

@Component({
  selector: 'app-action-cell-renderer',
  templateUrl: './detail-cell-renderer-journey.html',
})
export class DetailCellRendererJourney {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  onDelete() {
    this.params.onDelete(this.params.node.id);
  }

  onEdit(){
    this.params.onEdit(this.params.data)
  }

}
