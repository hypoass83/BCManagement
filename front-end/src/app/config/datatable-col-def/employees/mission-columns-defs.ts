// src/app/config/datatable-col-def/hr/mission.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const MISSION_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'Mission ID',
    field: 'missionId',
    sortable: true,
    filter: true,
    width: 100
  },
  {
    headerName: 'Title',
    field: 'title',
    sortable: true,
    filter: true,
    width: 200,
    cellStyle: { fontWeight: '600' }
  },
  {
    headerName: 'Employee',
    field: 'employee.name',
    sortable: true,
    filter: true,
    width: 180,
    valueGetter: (params) => {
      return params.data?.employee?.name || '-';
    }
  },
  {
    headerName: 'Destination',
    field: 'destination',
    sortable: true,
    filter: true,
    width: 180
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: true,
    filter: true,
    width: 130,
    cellRenderer: (params: any) => {
      const status = params.value;
      const statusConfig: any = {
        0: { label: 'Planifiée', color: 'warning', icon: 'ti-clock' },
        1: { label: 'En cours', color: 'info', icon: 'ti-player-play' },
        2: { label: 'Terminée', color: 'success', icon: 'ti-check' },
        3: { label: 'Annulée', color: 'danger', icon: 'ti-x' }
      };

      const config = statusConfig[status] || { label: 'Unknown', color: 'secondary', icon: 'ti-help' };

      return `<span class="badge bg-${config.color}">
                <i class="ti ${config.icon}"></i> ${config.label}
              </span>`;
    }
  },
  {
    headerName: 'Start Date',
    field: 'startDate',
    sortable: true,
    filter: true,
    width: 120,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('fr-FR');
    }
  },
  {
    headerName: 'End Date',
    field: 'endDate',
    sortable: true,
    filter: true,
    width: 120,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('fr-FR');
    }
  },
  {
    headerName: 'Duration',
    field: 'numberOfDays',
    sortable: true,
    filter: true,
    width: 100,
    cellRenderer: (params: any) => {
      const days = params.value || 0;
      return `<span class="badge bg-primary">${days} days</span>`;
    }
  },
  {
    headerName: 'Expenses',
    field: 'missionExpenses',
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
    cellStyle: { fontWeight: 'bold', color: '#f59e0b' }
  },
  {
    headerName: 'Daily Rate',
    field: 'dailyExpenseRate',
    sortable: true,
    filter: true,
    width: 130,
    valueFormatter: (params) => {
      if (params.value == null) return '0 XAF';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(params.value);
    },
    cellStyle: { fontSize: '0.875rem', color: '#6b7280' }
  },
  {
    headerName: 'Payment Mode',
    field: 'paymentMode',
    sortable: true,
    filter: true,
    width: 150,
    cellRenderer: (params: any) => {
      const mode = params.value;
      const modeConfig: any = {
        0: { label: 'Direct', color: 'success', icon: 'ti-cash' },
        1: { label: 'Intégré', color: 'info', icon: 'ti-coin' },
        2: { label: 'Remboursement', color: 'warning', icon: 'ti-receipt' }
      };

      const config = modeConfig[mode] || { label: 'Unknown', color: 'secondary', icon: 'ti-help' };

      return `<span class="badge bg-${config.color}">
                <i class="ti ${config.icon}"></i> ${config.label}
              </span>`;
    }
  },
  {
    headerName: 'Description',
    field: 'description',
    sortable: true,
    filter: true,
    width: 250,
    wrapText: true,
    autoHeight: true,
    cellRenderer: (params: any) => {
      const description = params.value || '';
      if (description.length > 100) {
        return description.substring(0, 100) + '...';
      }
      return description;
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