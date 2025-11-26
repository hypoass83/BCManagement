import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";

export const DIGITAL_PAYMENT_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: "ID",
    field: "paymentMethodID",
    width: 200,

  },
  {
    headerName: "name",
    field: "name",
    width: 200,

  },

  {
    headerName: "code",
    field: "code",
    width: 200,

  },

  {
    headerName: "description",
    field: "description",
    width: 200,

  },

  {
    headerName: "account",
    field: "account.accountLabel",
    width: 200,
  },

  {
    headerName: "accountManager",
    field: "accountManager.name",
    width: 200,

  },

  {
    headerName: "branch",
    field: "branch.branchCode",
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

