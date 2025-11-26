// src/app/config/datatable-col-def/hr/certification.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const CERTIFICATION_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'ID',
    field: 'certificationId',
    sortable: true,
    filter: true,
    width: 80
  },
  {
    headerName: 'Employee',
    field: 'employee.name',
    sortable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Title',
    field: 'title',
    sortable: true,
    filter: true,
    width: 250
  },
  {
    headerName: 'Certification Type',
    field: 'certificationTypeName',
    sortable: true,
    filter: true,
    width: 200
  },
  {
    headerName: 'Award Date',
    field: 'awardDate',
    sortable: true,
    filter: true,
    width: 130,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('fr-FR');
    }
  },
  {
    headerName: 'Bonus Amount',
    field: 'effectiveBonusAmount',
    sortable: true,
    filter: true,
    width: 150,
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
    headerName: 'Description',
    field: 'description',
    sortable: true,
    filter: true,
    width: 300
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
