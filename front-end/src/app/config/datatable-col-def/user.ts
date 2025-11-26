import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';
import { convertStringToFormatedDate } from 'src/app/tools/tools';

export const USER_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'ID',
    field: 'globalPersonID',
    width: 200,
  },
  {
    headerName: 'cniNumber', // translation key
    field: 'cni',
    flex:2,
  },
  {
    headerName: 'nameLabel', // translation key
    field: 'name',
    flex:2,
  },
  {
    headerName: 'surnameLabel', // translation key
    field: 'description',
    flex:2,
  },
  {
    headerName: 'profileLabel', // translation key
    field: 'profile.profileLabel',
    flex:2,
  },
  {
    headerName: 'jobLabel', // translation key
    field: 'job.jobLabel',
    flex:2,
  },
  {
    headerName: 'mobileNumberLabel', // translation key
    field: 'adress.adressPhoneNumber',
    flex:2,
  },
  {
    headerName: 'actionsLabel', // translation key
    field: 'actions',
    cellRenderer: ActionCellRendererComponent,
    width: 150,
    floatingFilter: false,

    cellRendererParams: {
      localActions: {
        edit: true,
        delete: true,
        print: false,
      },
      onEdit: null, // Pass method reference
      onDelete: null, // Pass method reference
    },
  },
];



export const CUSTOMER_COLUMNS_DEFS: ColDef[] = [
  {
    headerName: 'ID',
    field: 'id',
    flex:1
  },
  {
    headerName: 'Nid',
    field: 'custumerNumber',
    flex:1
  },
  {
    headerName: 'nameLabel', // translation key
    field: 'name',
    flex:3,
  },
  {
    headerName: 'surnameLabel', // translation key
    field: 'surName',
    flex:3,
  },
  {
    headerName: 'mobileNumberLabel', // translation key
    field: 'phone',
    flex:2,
  },
  {
    headerName: 'Sex', // translation key
    field: 'sex',
    flex:1,
  },

  {
    headerName: 'Date register', // translation key
    field: 'registerDate',
    valueFormatter: (params) => {
      return convertStringToFormatedDate(params.value);
    },
    flex:1,
  },


  {
    headerName: 'Insured', // translation key
    field: 'isInsured',
    flex:1,
  },
  {
    headerName: 'actionsLabel', // translation key
    field: 'actions',
    cellRenderer: ActionCellRendererComponent,
    width: 150,

    floatingFilter: false,
    cellRendererParams: {
      localActions: {
        edit: true,
        delete: true,
        print: false,
      },
      onEdit: null, // Pass method reference
      onDelete: null, // Pass method reference
    },
  },
];

export const CUSTOMER_NOTIFICATION_DEFS: ColDef[] = [
  {
    headerName: 'ID',
    field: 'id',
    flex:2
  },
  {
    headerName: 'Customer Name', // translation key
    field: 'name',
    flex:2,
  },
  {
    headerName: 'Phone Number', // translation key
    field: 'phone',
    flex:2,
  },
  {
    headerName: 'Sex', // translation key
    field: 'sex',
    flex:2,
  },
  {
    headerName: 'Language', // translation key
    field: 'language',
    flex:2,
  },
  {
    headerName: 'Status',
    field: 'status',
    flex:2,
  },
  {
    headerName: 'Date', // translation key
    field: 'date',
    flex: 2,

    valueFormatter: (params) => {
      return convertStringToFormatedDate(params.value);
    },
  },
  {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    width: 5,
    filter:false,
    sortable:true
  }
];
