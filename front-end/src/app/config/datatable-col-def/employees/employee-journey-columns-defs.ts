import { ColDef } from 'ag-grid-community';

export const EMPLOYEE_JOURNEY_COLUMNS: ColDef[] = [
  {
    headerName: 'Event Date',
    field: 'eventDateTime',
    valueFormatter: (params) => {
      if (!params.value) return '';
      const date = new Date(params.value);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    flex: 2,
    sort: 'asc' // Tri chronologique par défaut
  },
{
  headerName: 'Event Type',
  field: 'eventType',
  flex: 2,
  cellRenderer: (params: any) => {
    const eventType = params.value;
    const badges: any = {
      'HIRING': '<span class="badge bg-success">Hiring</span>',
      'CONTRACT_CREATED': '<span class="badge bg-primary">Contract</span>',
      'CONTRACT_TERMINATED': '<span class="badge bg-danger">Terminated</span>',
      'TRANSFER': '<span class="badge bg-info">Transfer</span>',
      'SALARY_ADJUSTMENT': '<span class="badge bg-warning">Salary</span>',
      'LOAN_GRANTED': '<span class="badge bg-info">Loan Granted</span>',
      'LOAN_PAID_OFF': '<span class="badge bg-success">Loan Paid</span>',
      'LOAN_CANCELLED': '<span class="badge bg-danger">Loan Cancelled</span>',
      'DEPARTURE': '<span class="badge bg-dark">Departure</span>'
    };
    return badges[eventType] || `<span class="badge bg-secondary">${eventType}</span>`;
  }
},
  {
    headerName: 'Details',
    field: 'eventSummary',
    autoHeight: true,
    wrapText: true,
    cellRenderer: (params: any) => {
      const div = document.createElement('div');
      div.innerHTML = params.value || '';
      div.style.padding = '8px 0';
      return div;
    },
    flex: 5
  },
  {
    headerName: 'Operator',
    field: 'operator',
    flex: 2
  }
];
