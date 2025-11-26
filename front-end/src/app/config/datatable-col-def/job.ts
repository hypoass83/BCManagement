import { ColDef } from "ag-grid-community";
import { ActionCellRendererComponent } from "src/app/pages/component/action-cell-renderer/action-cell-renderer.component";


export const JOB_COLUMNS_DEFS: ColDef[] = [

  {
    headerName: "ID",
    field: "jobID",
    width: 200,

  },
  {
    headerName: "code",
    field: "jobCode",
    width: 200,

  },
  {
    headerName: "name",
    field: "jobLabel",
    width: 200,

  },
  {
    headerName: "description",
    field: "jobDescription",
    width: 200,

  },

   {
    headerName: "department",
    field: "department.departmentName",
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

