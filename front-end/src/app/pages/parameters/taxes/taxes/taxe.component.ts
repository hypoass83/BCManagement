import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
// Column Definition Type Interface
import { firstValueFrom } from 'rxjs';


import { TaxeContributionModel, TaxeContributionService, LocalisationService, ProfileService } from 'src/app/generated';
import { openModal } from 'src/app/helper/helper-function';
import { TAXE_COLUMNS_DEFS } from 'src/app/config/datatable-col-def/parameters/taxe-contribution';



@Component({
  selector: 'app-taxes',
  templateUrl: './taxe.component.html',
  styleUrls: ['./taxe.component.scss'],
})
export class TaxeContributionsComponent implements OnInit {

  @ViewChild('agGrid') agGrid: AgGridAngular | undefined;
  public rowData: TaxeContributionModel[] = [];
  public gridApi!: GridApi;
  public actions: any;


  public quickFilterText = '';

  public taxeContributionToEdit: TaxeContributionModel | null = null

  constructor(
    private TaxeContributionService: TaxeContributionService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService,

  ) {

  }


  onGridReady(params: any) {
    this.gridApi = params.api;

    this.translocoService.langChanges$.subscribe(() => {
      this.gridApi.refreshHeader();
    });
    params.api.sizeColumnsToFit();

  }

  async getData() {

    try {
      this.rowData = await firstValueFrom(this.TaxeContributionService.taxeContributionControllerGetAllTaxeContributions())

    } catch (error) {

    }
  }



  handleRowDataChange(updatedRowData: TaxeContributionModel[]) {
    this.rowData = [];
    this.rowData = [...updatedRowData];
  }

  getCreateTaxeContribution() {
    this.taxeContributionToEdit = null;
    openModal('taxe-contribution-create-form')

  }

  onEdit(data: TaxeContributionModel) {
    this.taxeContributionToEdit = data;
    openModal('taxe-contribution-create-form')
  }

  async onDelete(data: TaxeContributionModel) {


    const res = await firstValueFrom(this.TaxeContributionService.taxeContributionControllerDeleteTaxeContribution(data.taxeContributionID ?? 0));
    this.getData();

  }

  public columnDefs = TAXE_COLUMNS_DEFS;

  public defaultColDef: ColDef = {
    filter: "agTextColumnFilter",
    floatingFilter: true,
    flex: 1,
  };


  public rowSelection: "single" | "multiple" = "multiple";
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50]; // [10, 25, 50];
  public themeClass = this.theme.theme;



  async ngOnInit() {
    this.getData()

    this.actions = await firstValueFrom(this.profileService.profileControllerGetActionByPath(window.location.pathname));

    this.translocoService.langChanges$.subscribe(() => {
      this.setupColumnDefs();
    });
  }

  async setupColumnDefs() {
    await firstValueFrom(this.translocoService.selectTranslate(this.columnDefs.map(x => x.headerName ?? "")));
    this.columnDefs = this.columnDefs.map(col => {
      if (col.field === 'actions') {
        return {
          ...col,
          headerName: this.t(col.headerName ?? ''),
          cellRendererParams: {
            ...col.cellRendererParams,
            onEdit: (data: TaxeContributionModel) => this.onEdit(data),
            onDelete: (data: any) => this.onDelete(data),
            actionProfile: this.actions,
          }
        };
      }
      return { ...col, headerName: this.t(col.headerName ?? "") };
    })

  }


  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }

}
