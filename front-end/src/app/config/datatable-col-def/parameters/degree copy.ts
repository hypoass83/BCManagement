import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";



export const LEAVE_TYPE_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: "ID",
    field: "leaveTypeID",
    width: 200,

  },
  {
    headerName: "code",
    field: "code",
    width: 200,

  },
  {
    headerName: "name",
    field: "name",
    width: 200,

  },

  {
    headerName: "isPaid",
    field: "isPaid",
    width: 200,

  },

  {
    headerName: "defaultDurationDays",
    field: "defaultDurationDays",
    width: 200,

  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: ActionCellRendererComponent,
    width: 150,
    floatingFilter: false,

    cellRendererParams:
    {
      localActions:
      {
        edit: true,
        delete: true,
        print: false,
      },
      onEdit: null,  // Pass method reference
      onDelete: null  // Pass method reference
    },
  },


];

