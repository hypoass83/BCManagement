import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const TRANSFER_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'Transfer ID',
    field: 'transferId',
    sortable: true,
    filter: true,
    width: 120
  },
  {
    headerName: 'Employee',
    field: 'employee.name',
    sortable: true,
    filter: true,
    width: 200,
    valueGetter: (params) => {
      return params.data?.employee?.name || 'N/A';
    }
  },
  {
    headerName: 'Origin Branch',
    field: 'originBranch.branchName',
    sortable: true,
    filter: true,
    width: 180,
    valueGetter: (params) => {
      return params.data?.originBranch?.branchName || 'N/A';
    }
  },
  {
    headerName: 'Destination Branch',
    field: 'destinationBranch.branchName',
    sortable: true,
    filter: true,
    width: 180,
    valueGetter: (params) => {
      return params.data?.destinationBranch?.branchName || 'N/A';
    }
  },
  {
    headerName: 'Transfer Date',
    field: 'transferDate',
    sortable: true,
    filter: true,
    width: 150,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString();
    }
  },
  {
    headerName: 'Transfer Expenses',
    field: 'transferExpenses',
    sortable: true,
    filter: true,
    width: 150,
    valueFormatter: (params) => {
      if (params.value == null) return '0';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF'
      }).format(params.value);
    }
  },
  {
    headerName: 'Reason',
    field: 'reason',
    sortable: true,
    filter: true,
    width: 250,
    wrapText: true,
    autoHeight: true
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
