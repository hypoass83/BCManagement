import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";


export const NOTIFICATION_SETTING: ColDef[] = [
    {
      headerName: "ID",
      field: "notificationSettingID",
      flex: 1,

    },
    {
      headerName: "French Version",
      field: "frenchMessage",
      flex: 3,

    },
    {
      headerName: "English Version",
      field: "englishMessage",
      flex: 3,

    },
    {
      headerName: "Type",
      field: "notificationType.type",
      flex: 2,

    },
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: ActionCellRendererComponent,
        flex: 1,
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
]
