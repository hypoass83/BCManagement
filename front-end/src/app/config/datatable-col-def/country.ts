import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";

export const COUNTRY_COLUMNS_DEFS: ColDef[] = [

  {
    headerName: "ID",
    field: "countryID",
    width: 200,

  },
  {
    headerName: "Code",
    field: "countryCode",
    width: 200, 

  },
  {
    headerName: "Name",
    field: "countryLabel",
    width: 200,

  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: ActionCellRendererComponent,
    width: 150,
    floatingFilter: false,

    cellRendererParams: {
      localActions: {
        edit: true,
        delete: true,
        print: false,
      },
      onEdit: null,  // Pass method reference
      onDelete: null  // Pass method reference
    },
  },


];

