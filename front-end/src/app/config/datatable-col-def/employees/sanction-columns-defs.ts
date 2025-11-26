// src/app/config/datatable-col-def/hr/sanction.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const SANCTION_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'Sanction ID',
    field: 'sanctionId',
    sortable: true,
    filter: true,
    width: 110
  },
  {
    headerName: 'Employee',
    field: 'employee.name',
    sortable: true,
    filter: true,
    width: 200,
    valueGetter: (params) => {
      return params.data?.employee?.name || '-';
    },
    cellStyle: { fontWeight: '600' }
  },
  {
    headerName: 'Sanction Type',
    field: 'sanctionType',
    sortable: true,
    filter: true,
    width: 160,
    cellRenderer: (params: any) => {
      const type = params.value;
      const typeConfig: any = {
        0: { label: 'Avertissement', color: 'warning', icon: 'ti-alert-triangle' },
        1: { label: 'Blâme', color: 'orange', icon: 'ti-alert-circle' },
        2: { label: 'Mise à pied', color: 'danger', icon: 'ti-ban' },
        3: { label: 'Réduction Salaire', color: 'purple', icon: 'ti-cash-off' },
        4: { label: 'Licenciement', color: 'dark', icon: 'ti-door-exit' }
      };

      const config = typeConfig[type] || { label: 'Unknown', color: 'secondary', icon: 'ti-help' };

      return `<span class="badge bg-${config.color}">
                <i class="ti ${config.icon}"></i> ${config.label}
              </span>`;
    }
  },
  {
    headerName: 'Sanction Date',
    field: 'sanctionDate',
    sortable: true,
    filter: true,
    width: 130,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('fr-FR');
    }
  },
  {
    headerName: 'Financial Penalty',
    field: 'financialPenalty',
    sortable: true,
    filter: true,
    width: 150,
    valueFormatter: (params) => {
      if (!params.value || params.value === 0) return '-';
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(params.value);
    },

  },
  {
    headerName: 'Suspension Days',
    field: 'suspensionDays',
    sortable: true,
    filter: true,
    width: 140,
    valueGetter: (params) => {
      return params.data?.suspensionDays || '-';
    },
    cellRenderer: (params: any) => {
      const days = params.data?.suspensionDays;
      if (days) {
        return `<span class="badge bg-danger">${days} days</span>`;
      }
      return '-';
    }
  },
  {
    headerName: 'Reason',
    field: 'reason',
    sortable: true,
    filter: true,
    width: 200,
    wrapText: true,
    autoHeight: true,
    cellRenderer: (params: any) => {
      const reason = params.value || '';
      if (reason.length > 80) {
        return reason.substring(0, 80) + '...';
      }
      return reason;
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
    headerName: 'Has Financial Impact',
    field: 'hasFinancialImpact',
    sortable: true,
    filter: true,
    width: 150,
    cellRenderer: (params: any) => {
      const hasImpact = params.value;
      if (hasImpact) {
        return '<span class="badge bg-danger"><i class="ti ti-coin-off"></i> Yes</span>';
      } else {
        return '<span class="badge bg-success"><i class="ti ti-check"></i> No</span>';
      }
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
