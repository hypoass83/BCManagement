// src/app/config/datatable-col-def/hr/certification-type.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const CERTIFICATION_TYPE_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'ID',
    field: 'certificationTypeID',
    sortable: true,
    filter: true,
    width: 80
  },
  {
    headerName: 'Code',
    field: 'code',
    sortable: true,
    filter: true,
    width: 120
  },
  {
    headerName: 'Name',
    field: 'name',
    sortable: true,
    filter: true,
    width: 250
  },
  {
    headerName: 'Description',
    field: 'description',
    sortable: true,
    filter: true,
    width: 300
  },
  {
    headerName: 'Default Bonus Amount',
    field: 'defaultBonusAmount',
    sortable: true,
    filter: true,
    width: 180,
    valueFormatter: (params) => {
      if (!params.value || params.value === 0) return '0 XAF';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(params.value);
    }
  },
  {
    headerName: 'Active',
    field: 'isActive',
    sortable: true,
    filter: true,
    width: 100,
    valueGetter: (params) => {
      return params.data?.isActive ? 'Yes' : 'No';
    }
  },
  {
    headerName: 'Creation Date',
    field: 'creationDate',
    sortable: true,
    filter: true,
    width: 150,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('fr-FR');
    }
  },
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      onEdit: (data: any) => { },
      onDelete: (data: any) => { },
      localActions: {
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
