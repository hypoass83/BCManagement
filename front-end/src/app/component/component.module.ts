import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableTableComponent } from './editable-table/editable-table.component';
import { AgGridAngular } from 'ag-grid-angular';



@NgModule({
  declarations: [
    EditableTableComponent
  ],
  imports: [
    CommonModule,
    AgGridAngular
  ]
})
export class ComponentModule { }
