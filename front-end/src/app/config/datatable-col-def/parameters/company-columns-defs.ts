import { ColDef } from 'ag-grid-community';
import { ActionCellRendererComponent } from 'src/app/pages/component/action-cell-renderer/action-cell-renderer.component';

export const COMPANY_COLUMNS_DEFS: ColDef[] = [
   {
    headerName: 'Logo',
    field: 'archive',
    width: 100,
    cellRenderer: (params: any) => {
      const archive = params.value;
      if (archive?.fileBase64) {
        const contentType = archive.contentType || 'image/png';
        const dataUrl = `data:${contentType};base64,${archive.fileBase64}`;
        return `<img src="${dataUrl}" alt="Logo" style="width: 40px; height: 40px; object-fit: contain; border-radius: 4px;" />`;
      }
      return '<span class="text-gray-400 text-xs">No logo</span>';
    }
  },
  {
    headerName: 'Company Name',
    field: 'companyName',
    filter: 'agTextColumnFilter',
    sortable: true,
    width: 200,
  },

  {
    headerName: 'Description',
    field: 'companyDescription',
    filter: 'agTextColumnFilter',
    sortable: true,
    width: 250,
    cellRenderer: (params: any) => {
      const description = params.value || '';
      return description.length > 50 ? description.substring(0, 50) + '...' : description;
    }
  },
  {
    headerName: 'Phone',
    field: 'adress.adressPhoneNumber',
    filter: 'agTextColumnFilter',
    sortable: true,
    width: 150,
  },
  {
    headerName: 'Email',
    field: 'adress.adressEmail',
    filter: 'agTextColumnFilter',
    sortable: true,
    width: 200,
  },

  {
    headerName: 'Town',
    field: 'adress.quarter.town.townLabel',
    filter: 'agTextColumnFilter',
    sortable: true,
    width: 150,
  },

  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: ActionCellRendererComponent,
    width: 150,
    floatingFilter: false,

    cellRendererParams: {
      localActions: {
        edit: true,
        delete: true,
        print: false,
      },
      onEdit: null,  // Pass method reference
      onDelete: null  // Pass method reference
    },
  },
];
