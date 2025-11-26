import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";


export const BRANCH_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: "ID",
    field: "branchID",
    flex:1,

  },
  {
    headerName: "Code",
    field: "branchCode",
    flex:1,

  },
  {
    headerName: "Name",
    field: "branchName",
    flex:2,

  },


  {
    headerName: "Description",
    field: "branchDescription",
    flex:2,

  },

  {
    headerName: "Mobile Number",
    field: "adress.adressPhoneNumber",
    flex:2,

  },
  {
    headerName: "Email",
    field: "adress.adressEmail",
    flex:2,

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

