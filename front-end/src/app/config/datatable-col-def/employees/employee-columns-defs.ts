// employee-columns-defs.ts
import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';




// export interface EmployeeModel {
//     globalPersonID?: number;
//     name?: string | null;
//     tiergroup?: string | null;
//     description?: string | null;
//     cni?: string | null;
//     adressID?: number;
//     adress?: AdressModel;
//     sexId?: number | null;
//     sex?: SexModel;
//     birthDate?: string;
//     maritalStatus?: string | null;
//     childrenCount?: number | null;
//     age?: number;
//     hireDate?: string;
//     cnpsNumber?: string | null;
//     branchId?: number;
//     branch?: BranchModel;
//     departmentId?: number;
//     department?: DepartmentModel;
//     jobId?: number;
//     job?: JobModel;
//     creationDate?: string;
//     modificationDate?: string | null;
//     isActive?: boolean;
//     departureDate?: string | null;
//     departureReason?: string | null;
//     seniorityInYears?: number;
//     isEligibleForSeniorityBonus?: boolean;
// }


export const EMPLOYEE_COLUMNS_DEFS: ColDef[] = [

  {
    headerName: 'nameLabel', // translation key
    field: 'name',
    flex: 2,
  },
  {
    headerName: 'surnameLabel', // translation key
    field: 'description',
    flex: 2,
  },

  {
    headerName: 'CNI',
    field: 'cni',
    filter: true,
    sortable: true,
  },
  {
    headerName: 'Branch',
    field: 'branch.branchName',
    filter: true,
    sortable: true,
  },
  {
    headerName: 'Job',
    field: 'job.jobLabel',
    filter: true,
    sortable: true,
  },
  {
    headerName: 'Hire Date',
    field: 'hireDate',
    filter: 'agDateColumnFilter',
    sortable: true,
    valueFormatter: (params) => {
      if (params.value) {
        return new Date(params.value).toLocaleDateString();
      }
      return '';
    },
  },
  {
    headerName: 'Actions',
    field: 'actions',
    cellRenderer: ActionCellRendererComponent,
    cellRendererParams: {
      onEdit: null,
      onDelete: null,
      localActions: {
        edit: true,
        delete: true,
        print: false,
      },
    },
    filter: false,
    sortable: false,
  },
];
