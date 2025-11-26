// src/app/config/datatable-col-def/hr/bonus.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const BONUS_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'Bonus ID',
    field: 'bonusId',
    sortable: true,
    filter: true,
    width: 100
  },
  {
    headerName: 'Type',
    field: 'bonusType',
    sortable: true,
    filter: true,
    width: 150,
    cellRenderer: (params: any) => {
      const type = params.value;
      const typeLabels: any = {
        0: 'Individuel',
        1: 'Collectif',
        2: 'Performance',
        3: 'Ancienneté',
        4: 'Exception',
        5: 'Projet',
        6: 'Annuel'
      };
      const typeColors: any = {
        0: 'primary',
        1: 'info',
        2: 'success',
        3: 'warning',
        4: 'purple',
        5: 'orange',
        6: 'teal'
      };
      const label = typeLabels[type] || 'Unknown';
      const color = typeColors[type] || 'secondary';

      return `<span class="badge bg-${color}">${label}</span>`;
    }
  },

  {
    headerName: 'Employee',
    field: 'employee.name',
    sortable: true,
    filter: true,
    width: 200,
    valueGetter: (params) => {
      return params.data?.employee?.name || '-';
    }
  },
  {
    headerName: 'Branch',
    field: 'branch.branchName',
    sortable: true,
    filter: true,
    width: 200,
    valueGetter: (params) => {
      return params.data?.branch?.branchName || '-';
    }
  },
  {
    headerName: 'Amount',
    field: 'amount',
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
    cellStyle: { fontWeight: 'bold', color: '#10b981' }
  },
  {
    headerName: 'Affected Employees',
    field: 'affectedEmployeesCount',
    sortable: true,
    filter: true,
    width: 150,
    valueGetter: (params) => {
      if (params.data?.isCollective) {
        return params.data?.affectedEmployeesCount || 0;
      }
      return '-';
    },
    cellRenderer: (params: any) => {
      if (params.data?.isCollective) {
        const count = params.data?.affectedEmployeesCount || 0;
        return `<span class="badge bg-info">${count} employees</span>`;
      }
      return '-';
    }
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
