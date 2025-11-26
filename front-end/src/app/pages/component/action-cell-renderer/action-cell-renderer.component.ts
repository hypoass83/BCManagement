import { Component } from '@angular/core';
import { openModal } from 'src/app/helper/helper-function';

@Component({
  selector: 'app-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
})
export class ActionCellRendererComponent {
  params: any;
  path: any;
  deleteButtonIsVisible = false;
  actionProfile: any


  localActions: any;

  printroute = '/receipt/';
  IdToPrint = 0;


  constructor() { }

  agInit(params: any): void {
    this.params = params;



    this.actionProfile = params.actionProfile;
    this.localActions = params.localActions;

    if (this.params.idProperty) {
      this.printroute = this.printroute + params.printroute;
      this.IdToPrint = this.params.data[this.params.idProperty];
    }
  }

  onDelete() {
    console.log("asasas")
    this.params.onDelete(this.params.data);
  }

  onEdit() {
    this.params.onEdit(this.params.data);
  }

  print(){
    this.params.print(this.params.data);
  }
}
