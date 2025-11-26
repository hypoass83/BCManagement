// certification-type-list.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { CertificationTypeModel, CertificationTypeService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { CERTIFICATION_TYPE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/certification-type';

@Component({
  selector: 'app-certification-type-list',
  templateUrl: './certification-type-list.component.html',
  styleUrls: ['./certification-type-list.component.scss'],
})
export class CertificationTypeListComponent implements OnInit {

  public rowData = signal<CertificationTypeModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public certificationTypeToEdit: CertificationTypeModel | null = null;

  constructor(
    private certificationTypeService: CertificationTypeService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createCertificationType() {
    this.certificationTypeToEdit = null;
    openModal("certification-type-create-form");
  }

  onEdit(data: CertificationTypeModel) {
    this.certificationTypeToEdit = data;
    openModal("certification-type-create-form");
  }

  async onDelete(data: CertificationTypeModel) {
    if (!confirm('Are you sure you want to delete this certification type?')) {
      return;
    }

    try {
      await firstValueFrom(
        this.certificationTypeService.certificationTypeControllerDeleteCertificationType(data.certificationTypeID ?? 0)
      );
      this.toastrService.success('Certification type deleted successfully', 'Success');
      await this.loadCertificationTypes();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete certification type',
        'Error'
      );
    }
  }

  async loadCertificationTypes() {
    try {
      const certificationTypes = await firstValueFrom(
        this.certificationTypeService.certificationTypeControllerGetAllCertificationTypes()
      );
      this.rowData.set(certificationTypes);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load certification types',
        'Error'
      );
    }
  }

  public columnDefs = CERTIFICATION_TYPE_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadCertificationTypes();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        CERTIFICATION_TYPE_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = CERTIFICATION_TYPE_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: CertificationTypeModel) => this.onEdit(data),
            onDelete: (data: CertificationTypeModel) => this.onDelete(data),
            actionProfile: this.actions,
          }
        };
      }
      return { ...col, headerName: this.t(col.headerName ?? "") };
    });
  }

  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }
}
