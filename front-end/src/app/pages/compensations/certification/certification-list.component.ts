// certification-list.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

import { CertificationModel, CertificationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { CERTIFICATION_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/certification';

@Component({
  selector: 'app-certification-list',
  templateUrl: './certification-list.component.html',
  styleUrls: ['./certification-list.component.scss'],
})
export class CertificationListComponent implements OnInit {

  public rowData = signal<CertificationModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public certificationToEdit: CertificationModel | null = null;

  constructor(
    private certificationService: CertificationService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createCertification() {
    this.certificationToEdit = null;
    openModal("certification-create-form");
  }

  onEdit(data: CertificationModel) {
    this.certificationToEdit = data;
    openModal("certification-create-form");
  }

  async onDelete(data: CertificationModel) {
    if (!confirm('Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      await firstValueFrom(
        this.certificationService.certificationControllerDeleteCertification(data.certificationId ?? 0)
      );
      this.toastrService.success('Certification deleted successfully', 'Success');
      await this.loadCertifications();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete certification',
        'Error'
      );
    }
  }

  async loadCertifications() {
    try {
      const certifications = await firstValueFrom(
        this.certificationService.certificationControllerGetAllCertifications()
      );
      this.rowData.set(certifications);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load certifications',
        'Error'
      );
    }
  }

  public columnDefs = CERTIFICATION_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadCertifications();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        CERTIFICATION_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = CERTIFICATION_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: CertificationModel) => this.onEdit(data),
            onDelete: (data: CertificationModel) => this.onDelete(data),
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
