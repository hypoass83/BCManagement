// src/app/config/datatable-col-def/hr/salary-revision.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const SALARY_REVISION_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'Revision ID',
    field: 'salaryRevisionId',
    sortable: true,
    filter: true,
    width: 100
  },
  {
    headerName: 'Type',
    field: 'revisionType',
    sortable: true,
    filter: true,
    width: 150,
    cellRenderer: (params: any) => {
      const type = params.value;

      if (type === 0) {
        return '<span class="badge bg-success"><i class="ti ti-arrow-up"></i> Augmentation</span>';
      } else if (type === 1) {
        return '<span class="badge bg-danger"><i class="ti ti-arrow-down"></i> Déduction</span>';
      }

      return '<span class="badge bg-secondary">Unknown</span>';
    }
  },
  {
    headerName: 'Scope',
    field: 'revisionScope',
    sortable: true,
    filter: true,
    width: 120,
    cellRenderer: (params: any) => {
      const scope = params.value;
      if (scope === 'Individual') {
        return '<span class="badge bg-primary"><i class="ti ti-user"></i> Individual</span>';
      } else if (scope === 'Collective') {
        return '<span class="badge bg-info"><i class="ti ti-users"></i> Collective</span>';
      }
      return '<span class="badge bg-secondary">Unknown</span>';
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
    headerName: 'Effective Date',
    field: 'effectiveDate',
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
