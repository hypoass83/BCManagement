import { Component, OnInit, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { LeaveModel, LeaveService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { LEAVE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/employees/leave-columns-defs';

@Component({
  selector: 'app-leave-list',
  templateUrl: './leave-list.component.html',
  styleUrls: ['./leave-list.component.scss'],
})
export class LeaveListComponent implements OnInit {

  public rowData = signal<LeaveModel[]>([]);
  public gridApi!: GridApi;
  public quickFilterText = '';
  public actions: any;
  public leaveToEdit: LeaveModel | null = null;

  // Filter state
  public activeFilter: 'all' | 'pending' | 'approved' | 'rejected' = 'all';

  constructor(
    private leaveService: LeaveService,
    private toastrService: ToastrService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService
  ) { }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  createLeave() {
    this.leaveToEdit = null;
    openModal("leave-create-form");
  }

  onEdit(data: LeaveModel) {
    this.leaveToEdit = data;
    openModal("leave-create-form");
  }

  async onDelete(data: LeaveModel) {
    if (!confirm('Are you sure you want to delete this leave request?')) {
      return;
    }

    try {
      await firstValueFrom(
        this.leaveService.leaveControllerDeleteLeave(data.leaveId ?? 0)
      );
      this.toastrService.success('Leave request deleted successfully', 'Success');
      await this.loadLeaves();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to delete leave request',
        'Error'
      );
    }
  }

  async onApprove(data: LeaveModel) {
    if (!confirm('Are you sure you want to approve this leave request?')) {
      return;
    }

    try {
      await firstValueFrom(
        this.leaveService.leaveControllerApproveOrRejectLeave({
          leaveId: data.leaveId ?? 0,
          status: 1 // Approuvé
        })
      );
      this.toastrService.success('Leave request approved successfully', 'Success');
      await this.loadLeaves();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to approve leave request',
        'Error'
      );
    }
  }

  async onReject(data: LeaveModel) {
    if (!confirm('Are you sure you want to reject this leave request?')) {
      return;
    }

    try {
      await firstValueFrom(
        this.leaveService.leaveControllerApproveOrRejectLeave({
          leaveId: data.leaveId ?? 0,
          status: 2 // Rejeté
        })
      );
      this.toastrService.success('Leave request rejected successfully', 'Success');
      await this.loadLeaves();
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to reject leave request',
        'Error'
      );
    }
  }

  async loadLeaves() {
    try {
      let leaves: LeaveModel[] = [];

      switch (this.activeFilter) {
        case 'all':
          leaves = await firstValueFrom(
            this.leaveService.leaveControllerGetAllLeaves()
          );
          break;
        case 'pending':
          leaves = await firstValueFrom(
            this.leaveService.leaveControllerGetPendingLeaves()
          );
          break;
        case 'approved':
          leaves = await firstValueFrom(
            this.leaveService.leaveControllerGetApprovedLeaves()
          );
          break;
        case 'rejected':
          leaves = await firstValueFrom(
            this.leaveService.leaveControllerGetLeavesByStatus(2) // Rejeté
          );
          break;
      }

      this.rowData.set(leaves);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load leave requests',
        'Error'
      );
    }
  }

  async onFilterChange(filter: 'all' | 'pending' | 'approved' | 'rejected') {
    this.activeFilter = filter;
    await this.loadLeaves();
  }

  public columnDefs = LEAVE_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
  };

  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  public themeClass = this.theme.theme;

  async ngOnInit() {
    await this.loadLeaves();
    await this.setupColumnDefs();
  }

  async setupColumnDefs() {
    this.actions = await firstValueFrom(
      this.profileService.profileControllerGetActionByPath(window.location.pathname)
    );

    await firstValueFrom(
      this.translocoService.selectTranslate(
        LEAVE_COLUMNS_DEFS.map(x => x.headerName ?? "")
      )
    );

    this.columnDefs = LEAVE_COLUMNS_DEFS.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: LeaveModel) => this.onEdit(data),
            onDelete: (data: LeaveModel) => this.onDelete(data),
            onApprove: (data: LeaveModel) => this.onApprove(data),
            onReject: (data: LeaveModel) => this.onReject(data),
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
