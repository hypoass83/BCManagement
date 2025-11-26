import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";

export const QUARTER_COLUMNS_DEFS: ColDef[] = [

  {
    headerName: "ID",
    field: "quarterID",
    width: 200,

  },
  {
    headerName: "code",
    field: "quarterCode",
    width: 200,

  },
  {
    headerName: "name",
    field: "quarterLabel",
    width: 200,

  },

  {
    headerName: "town",
    field: "town.townLabel",
    width: 200,

  },
  {
    headerName: "region",
    field: "town.region.regionLabel",
    width: 200,

  },
  {
    headerName: "country",
    field: "town.region.country.countryLabel",
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

