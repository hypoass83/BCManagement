// contract-columns-defs.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const CONTRACT_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'Employee',
    field: 'employee.name',
    filter: true,
    sortable: true,
    valueGetter: (params) => {
      return params.data?.employee?.name || 'N/A';
    }
  },
  {
    headerName: 'Contract Reference',
    field: 'contractReference',
    filter: true,
    sortable: true,
  },

  {
    headerName: 'End Date',
    field: 'endDate',
    filter: 'agDateColumnFilter',
    sortable: true,
    valueFormatter: (params) => {
      if (params.value) {
        return new Date(params.value).toLocaleDateString();
      }
      return 'Indefinite';
    },
  },

  {
    headerName: 'Gross Salary',
    field: 'currentSalary.grossMonthlyBaseSalary',
    filter: 'agNumberColumnFilter',
    sortable: true,
    valueFormatter: (params) => {
      if (params.value) {
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'XAF',
          minimumFractionDigits: 0
        }).format(params.value);
      }
      return '';
    },
  },
  {
    headerName: 'In Probation',
    field: 'isInProbation',
    filter: true,
    sortable: true,
    valueFormatter: (params) => params.value ? 'Yes' : 'No',
  },
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      onEdit: null,
      onRenew: null,
      onTerminate: null,

      localActions: {
        edit: true,
        print: true,
      },
      printroute: "contract",
      idProperty: "contractId",
    },
    filter: false,
    sortable: false,
  },
];
