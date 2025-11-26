import { ColDef } from "ag-grid-community";
import { ProfileModel } from '../../generated/model/profileModel';
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";

export const ADVANCED_PROFILE_COLUMNS_DEFS: ColDef[] = [

  {
    headerName: "ID",
    field: "profileID",
    flex: 2,

  },
  {
    headerName: "Name",
    field: "profileLabel",
    flex: 2,

  },

  {
    headerName: "Code",
    field: "profileCode",
    flex: 2,

  },

  {
    headerName: "Level",
    field: "profileLevel",
    flex: 2,

  },
  {
    headerName: "State",
    field: "profileState",
    flex: 2,

    filter:false
  },
  {
    headerName: "Description",
    field: "profileDescription",
    flex:2,

  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: ActionCellRendererComponent,
    flex: 2,
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


export const PROFILE_COLUMNS_DEFS: ColDef[] = [

  {
    headerName: "ID",
    field: "profileID",
    flex: 2,

  },
  {
    headerName: "Name",
    field: "profileLabel",
    flex: 2,

  },

  {
    headerName: "Code",
    field: "profileCode",
    flex: 2,

  },

  {
    headerName: "Level",
    field: "profileLevel",
    flex: 2,

  },
  {
    headerName: "State",
    field: "profileState",
    flex: 2,

    filter:false
  },
  {
    headerName: "Description",
    field: "profileDescription",
    flex:2,

  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: ActionCellRendererComponent,
    flex: 2,
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



