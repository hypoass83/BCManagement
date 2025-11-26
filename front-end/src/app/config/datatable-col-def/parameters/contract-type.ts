// src/app/config/datatable-col-def/hr/contract-type.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const CONTRACT_TYPE_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'ID',
    field: 'contractTypeID',
    sortable: true,
    filter: true,
    width: 80
  },
  {
    headerName: 'Code',
    field: 'contractTypeCode',
    sortable: true,
    filter: true,
    width: 120
  },
  {
    headerName: 'Name',
    field: 'contractTypeName',
    sortable: true,
    filter: true,
    width: 250
  },
  {
    headerName: 'Description',
    field: 'contractTypeDescription',
    sortable: true,
    filter: true,
    width: 350
  },
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      onEdit: (data: any) => { },
      onDelete: (data: any) => { },

      localActions:
      {
        edit: true,
        delete: true,
        print: false,
      },
    },
    width: 150,
    pinned: 'right',
    sortable: false,
    filter: false
  }
];
