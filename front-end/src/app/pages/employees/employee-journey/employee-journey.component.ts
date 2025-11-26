import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridThemeService } from 'src/app/services/theme/theme.service';
import { firstValueFrom } from 'rxjs';
import {
  EmployeeJourneyService,
  EmployeeService,
  EmployeeModel,
  EmployeeJourneyEventModel,
  ProfileService,
  ActionMenuProfileModel
} from 'src/app/generated';
import { EMPLOYEE_JOURNEY_COLUMNS } from 'src/app/config/datatable-col-def/employees/employee-journey-columns-defs';

@Component({
  selector: 'app-employee-journey',
  templateUrl: './employee-journey.component.html',
  styleUrls: ['./employee-journey.component.scss']
})
export class EmployeeJourneyComponent implements OnInit {

  // Grid data
  rowData: EmployeeJourneyEventModel[] = [];

  // Selected employee details
  selectedEmployee: EmployeeModel | null = null;

  // Forms
  searchForm!: FormGroup;

  // Grid configuration
  gridApi!: GridApi;
  quickFilterText = '';
  columnDefs: ColDef[] = EMPLOYEE_JOURNEY_COLUMNS;

  defaultColDef: ColDef = {
    filter: 'agTextColumnFilter',
    floatingFilter: true,
    flex: 1,
    resizable: true
  };

  rowSelection: 'single' | 'multiple' = 'multiple';
  paginationPageSize = 10;
  paginationPageSizeSelector: number[] | boolean = [10, 25, 50];
  themeClass = this.theme.theme;

  // Employees list for search
  employees: EmployeeModel[] = [];

  // Actions profile
  actions!: ActionMenuProfileModel;

  // Filter buttons
  activeFilter: 'all' | 'contracts' | 'transfers' = 'all';

  constructor(
    private employeeService: EmployeeService,
    private employeeJourneyService: EmployeeJourneyService,
    private translocoService: TranslocoService,
    private profileService: ProfileService,
    private theme: AgGridThemeService,
    private builder: FormBuilder
  ) {
    this.initSearchForm();
  }

  async ngOnInit() {
    await this.setupColumnDefs();
    this.setupFormSubscriptions();
  }

  initSearchForm() {
    this.searchForm = this.builder.group({
      employeeId: [null]
    });
  }

  setupFormSubscriptions() {
    this.searchForm.get('employeeId')?.valueChanges.subscribe(async (employeeId) => {
      if (employeeId) {
        await this.loadEmployeeJourney(employeeId);
        await this.loadEmployeeDetails(employeeId);
      } else {
        this.rowData = [];
        this.selectedEmployee = null;
      }
    });
  }

  async loadEmployeeJourney(employeeId: number) {
    try {
      let journey: EmployeeJourneyEventModel[] = [];

      switch (this.activeFilter) {
        case 'all':
          journey = await firstValueFrom(
            this.employeeJourneyService.employeeJourneyControllerGetEmployeeJourney(employeeId)
          );
          break;
        case 'contracts':
          journey = await firstValueFrom(
            this.employeeJourneyService.employeeJourneyControllerGetEmployeeContractHistory(employeeId)
          );
          break;
        case 'transfers':
          journey = await firstValueFrom(
            this.employeeJourneyService.employeeJourneyControllerGetEmployeeTransferHistory(employeeId)
          );
          break;
      }

      this.rowData = journey;
    } catch (error) {
      console.error('Error loading employee journey:', error);
      this.rowData = [];
    }
  }

  async loadEmployeeDetails(employeeId: number) {
    try {
      this.selectedEmployee = await firstValueFrom(
        this.employeeService.employeeControllerGetEmployeeById(employeeId)
      );
    } catch (error) {
      console.error('Error loading employee details:', error);
      this.selectedEmployee = null;
    }
  }

  async onFilterChange(filter: 'all' | 'contracts' | 'transfers') {
    this.activeFilter = filter;
    const employeeId = this.searchForm.get('employeeId')?.value;
    if (employeeId) {
      await this.loadEmployeeJourney(employeeId);
    }
  }

  async onInputEmployees(event: any) {
    const filter = event.target.value;
    if (filter && filter.length >= 2) {
      try {

        this.employees = await firstValueFrom(
          this.employeeService.employeeControllerGetAllEmployees()
        );

        // Filtrer localement par nom ou CNI
        this.employees = this.employees.filter(emp =>
          emp.name?.toLowerCase().includes(filter.toLowerCase()) ||
          emp.cni?.toLowerCase().includes(filter.toLowerCase())
        );
      } catch (error) {
        console.error('Error searching employees:', error);
      }
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  async setupColumnDefs() {
    try {
      this.actions = await firstValueFrom(
        this.profileService.profileControllerGetActionByPath(window.location.pathname)
      );

      await firstValueFrom(
        this.translocoService.selectTranslate(
          this.columnDefs.map(x => x.headerName ?? '')
        )
      );

      this.columnDefs = this.columnDefs.map(col => ({
        ...col,
        headerName: this.t(col.headerName ?? '')
      }));
    } catch (error) {
      console.error('Error setting up columns:', error);
    }
  }

  t(key: string, params?: object): string {
    return this.translocoService.translate(key, params);
  }

  // Calculer l'ancienneté en format lisible
  getSeniorityDisplay(): string {
    if (!this.selectedEmployee?.seniorityInYears) return 'N/A';
    const years = Math.floor(this.selectedEmployee.seniorityInYears);
    const months = Math.floor((this.selectedEmployee.seniorityInYears - years) * 12);
    return `${years} year(s) ${months} month(s)`;
  }

  // Formater le salaire
  formatSalary(amount: number | undefined): string {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
