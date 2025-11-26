
import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";


export const TAXE_COLUMNS_DEFS: ColDef[] = [

  {
    headerName: "ID",
    field: "taxeContributionID",
    width: 200,

  },
  {
    headerName: "code",
    field: "taxeContributionCode",
    width: 200,

  },
   {
    headerName: "name",
    field: "taxeContributionDescription",
    width: 200,

  },

  {
    headerName: "rate",
    field: "rate",
    width: 200,

  },

  {
    headerName: "fixedAmount",
    field: "fixedAmount",
    width: 200,

  },

    {
    headerName: "isActive",
    field: "isActive",
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

