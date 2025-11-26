// src/app/config/datatable-col-def/hr/leave.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const LEAVE_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'Leave ID',
    field: 'leaveId',
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
      return params.data?.employee?.name || '-';
    },
    cellStyle: { fontWeight: '600' }
  },
  {
    headerName: 'Leave Type',
    field: 'leaveTypeName',
    sortable: true,
    filter: true,
    width: 150,
    cellRenderer: (params: any) => {
      const code = params.data?.leaveTypeCode || '';
      const name = params.value || '';
      return `<span class="badge bg-primary">${code}</span> ${name}`;
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
      const statusConfig: any = {
        0: { label: 'En attente', color: 'warning', icon: 'ti-clock' },
        1: { label: 'Approuvé', color: 'success', icon: 'ti-check' },
        2: { label: 'Rejeté', color: 'danger', icon: 'ti-x' },
        3: { label: 'Annulé', color: 'secondary', icon: 'ti-ban' }
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
    headerName: 'Paid',
    field: 'isPaid',
    sortable: true,
    filter: true,
    width: 100,
    cellRenderer: (params: any) => {
      const isPaid = params.value;
      if (isPaid) {
        return '<span class="badge bg-success"><i class="ti ti-check"></i> Paid</span>';
      } else {
        return '<span class="badge bg-secondary"><i class="ti ti-x"></i> Unpaid</span>';
      }
    }
  },
  {
    headerName: 'Request Date',
    field: 'requestDate',
    sortable: true,
    filter: true,
    width: 130,
    valueFormatter: (params) => {
      if (!params.value) return '';
      return new Date(params.value).toLocaleDateString('fr-FR');
    }
  },
  {
    headerName: 'Approval Date',
    field: 'approvalDate',
    sortable: true,
    filter: true,
    width: 130,
    valueFormatter: (params) => {
      if (!params.value) return '-';
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
    autoHeight: true,
    cellRenderer: (params: any) => {
      const reason = params.value || '';
      if (reason.length > 100) {
        return reason.substring(0, 100) + '...';
      }
      return reason;
    }
  },
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      onEdit: (data: any) => { },
      onDelete: (data: any) => { },
      onApprove: (data: any) => { },
      onReject: (data: any) => { }
      ,
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
