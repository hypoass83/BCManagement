import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";

export const TILL_COLUMNS_DEFS: ColDef[] = [

  {
    headerName: "ID",
    field: "userTillID",
    width: 200,
  },
  {
    headerName: "name",
    field: "till.name",
    width: 200,
  },

  {
    headerName: "code",
    field: "till.code",
    width: 200,
  },

  {
    headerName: "description",
    field: "till.description",
    width: 200,

  },
  {
    headerName: "branch",
    field: "till.branch.branchCode",
    width: 200,

  },
  {
    headerName: "teller",

    width: 200,

    valueGetter: (params) => {
      if (params.data.user) {
        return `${params.data.user.name} ${params.data.user.description}`;
      }else{
        return `N/A`
      }
    }
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

