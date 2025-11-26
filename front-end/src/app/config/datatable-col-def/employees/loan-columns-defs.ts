// src/app/config/datatable-col-def/hr/loan.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';


export const LOAN_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'Loan ID',
    field: 'loanId',
    sortable: true,
    filter: true,
    width: 100
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
    headerName: 'Total Amount',
    field: 'totalAmount',
    sortable: true,
    filter: true,
    width: 150,
    valueFormatter: (params) => {
      if (params.value == null) return '0 XAF';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(params.value);
    }
  },
  {
    headerName: 'Monthly Amount',
    field: 'monthlyAmount',
    sortable: true,
    filter: true,
    width: 150,
    valueFormatter: (params) => {
      if (params.value == null) return '0 XAF';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(params.value);
    }
  },
  {
    headerName: 'Repaid Amount',
    field: 'repaidAmount',
    sortable: true,
    filter: true,
    width: 150,
    valueFormatter: (params) => {
      if (params.value == null) return '0 XAF';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(params.value);
    }
  },
  {
    headerName: 'Remaining Balance',
    field: 'remainingBalance',
    sortable: true,
    filter: true,
    width: 150,
    valueFormatter: (params) => {
      if (params.value == null) return '0 XAF';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(params.value);
    },
    cellStyle: (params) => {
      if (params.value === 0) {
        return { color: 'green', fontWeight: 'bold' };
      }
      return null;
    }
  },
  {
    headerName: 'Progress',
    field: 'progressPercentage',
    sortable: true,
    filter: true,
    width: 120,
    valueFormatter: (params) => {
      if (params.value == null) return '0%';
      return `${Math.round(params.value)}%`;
    },
    cellRenderer: (params: any) => {
      const percentage = params.value || 0;
      const color = percentage === 100 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444';

      return `
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="flex-grow: 1; height: 8px; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${percentage}%; background-color: ${color}; transition: width 0.3s;"></div>
          </div>
          <span style="font-size: 12px; font-weight: 600;">${Math.round(percentage)}%</span>
        </div>
      `;
    }
  },
  {
    headerName: 'Grant Date',
    field: 'grantDate',
    sortable: true,
    filter: true,
    width: 130,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('fr-FR');
    }
  },
  {
    headerName: 'Duration',
    field: 'repaymentMonths',
    sortable: true,
    filter: true,
    width: 100,
    valueFormatter: (params) => {
      return `${params.value} months`;
    }
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: true,
    filter: true,
    width: 130,
    cellRenderer: (params: any) => {
      const status = params.value;
      let badge = '';

      switch (status) {
        case 0: // EnCours
          badge = '<span class="badge bg-warning">En cours</span>';
          break;
        case 1: // Soldé
          badge = '<span class="badge bg-success">Soldé</span>';
          break;
        case 2: // Annulé
          badge = '<span class="badge bg-danger">Annulé</span>';
          break;
        default:
          badge = '<span class="badge bg-secondary">Unknown</span>';
      }

      return badge;
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
      onAddPayment: (data: any) => { },
      localActions: {
        edit: true,
        delete: true,
        print: false,
      },
    },
    width: 180,
    pinned: 'right',
    sortable: false,
    filter: false
  }
];
