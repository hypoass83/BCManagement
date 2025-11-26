import { Component, Input } from "@angular/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "./styles.css";
import {
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  RowValueChangedEvent,
} from 'ag-grid-community';

@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss']
})
export class EditableTableComponent {

  private gridApi!: GridApi;

  @Input() rowData: any[] | null = getRowData();

  @Input() columnDefs: ColDef[] = [
    {
      field: "make",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Porsche", "Toyota", "Ford", "AAA", "BBB", "CCC"],
      },
    },
    { field: "model" },
    { field: "field4", headerName: "Read Only", editable: false },
    {
      headerName: "Suppress Navigable",
      field: "field5",
      suppressNavigable: true,
      minWidth: 200,
    },
    { headerName: "Read Only", field: "field6", editable: false },
  ];
  public defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    cellDataType: false,
  };

  public editType = "fullRow" as const;
  public themeClass = "ag-theme-quartz";




  onCellValueChanged(event: CellValueChangedEvent) {

  }

  onRowValueChanged(event: RowValueChangedEvent) {
    const data = event.data;

  }

  onBtStopEditing() {
    this.gridApi.stopEditing();
  }

  onBtStartEditing() {
    this.gridApi.setFocusedCell(1, "make");
    this.gridApi.startEditingCell({
      rowIndex: 1,
      colKey: "make",
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
}

function getRowData() {
  const rowData = [];
  for (let i = 0; i < 10; i++) {
    rowData.push({
      make: "Toyota",
      model: "Celica",
      price: 35000 + i * 1000,
      field4: "Sample XX",
      field5: "Sample 22",
      field6: "Sample 23",
    });
    rowData.push({
      make: "Ford",
      model: "Mondeo",
      price: 32000 + i * 1000,
      field4: "Sample YY",
      field5: "Sample 24",
      field6: "Sample 25",
    });
    rowData.push({
      make: "Porsche",
      model: "Boxster",
      price: 72000 + i * 1000,
      field4: "Sample ZZ",
      field5: "Sample 26",
      field6: "Sample 27",
    });
  }
  return rowData;
}
