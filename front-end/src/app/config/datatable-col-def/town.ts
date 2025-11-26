import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";

export const TOWN_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: "ID",
    field: "townID",
    width: 200,

  },
  {
    headerName: "code",
    field: "townCode",
    width: 200,

  },
  {
    headerName: "name",
    field: "townLabel",
    width: 200,

  },
  {
    headerName: "region",
    field: "region.regionLabel",
    width: 200,

  },
  {
    headerName: "country",
    field: "region.country.countryLabel",
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

