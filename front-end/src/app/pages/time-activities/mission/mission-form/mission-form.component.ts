import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  MissionModel, 
  MissionCreateDTO, 
  MissionUpdateDTO,
  MissionService,
  EmployeeService,
  EmployeeModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mission-form',
  templateUrl: './mission-form.component.html',
  styleUrls: ['./mission-form.component.scss'],
})
export class MissionFormComponent implements OnInit, OnChanges {

  @Input() missionToUpdate: MissionModel | null = null;
  @Output() missionSaved = new EventEmitter<void>();

  public missionForm!: FormGroup;
  public employees: EmployeeModel[] = [];
  public isSubmitted = false;

  // Mission status options
  public missionStatusOptions = [
    { label: 'Planifiée', value: 0, icon: 'ti-clock', color: 'warning' },
    { label: 'En cours', value: 1, icon: 'ti-player-play', color: 'info' },
    { label: 'Terminée', value: 2, icon: 'ti-check', color: 'success' },
    { label: 'Annulée', value: 3, icon: 'ti-x', color: 'danger' }
  ];

  // Payment mode options
  public paymentModeOptions = [
    { label: 'Direct', value: 0, icon: 'ti-cash', description: 'Paiement direct à l\'employé' },
    { label: 'Intégré au salaire', value: 1, icon: 'ti-coin', description: 'Intégré dans le salaire du mois' },
    { label: 'Remboursement', value: 2, icon: 'ti-receipt', description: 'Sur présentation de justificatifs' }
  ];

  // Calculated fields
  public calculatedDays: number = 0;
  public dailyRate: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private missionService: MissionService,
    private employeeService: EmployeeService,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  async ngOnInit() {
    try {
      // Charger les employés
      this.employees = await firstValueFrom(
        this.employeeService.employeeControllerGetAllEmployees()
      );
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load data',
        'Error'
      );
    }

    this.setupFormListeners();
  }

  ngOnChanges(): void {
    if (this.missionToUpdate) {
      this.initEditForm(this.missionToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  setupFormListeners() {
    // Calculer automatiquement le nombre de jours
    this.missionForm.get('startDate')?.valueChanges.subscribe(() => this.calculateDays());
    this.missionForm.get('endDate')?.valueChanges.subscribe(() => this.calculateDays());
    
    // Calculer le taux journalier
    this.missionForm.get('missionExpenses')?.valueChanges.subscribe(() => this.calculateDailyRate());
    this.missionForm.get('numberOfDays')?.valueChanges.subscribe(() => this.calculateDailyRate());
  }

  calculateDays() {
    const startDate = this.missionForm.get('startDate')?.value;
    const endDate = this.missionForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      this.calculatedDays = diffDays;
      
      // Auto-remplir numberOfDays si vide
      if (!this.missionForm.get('numberOfDays')?.value || this.missionForm.get('numberOfDays')?.value === 0) {
        this.missionForm.get('numberOfDays')?.setValue(diffDays, { emitEvent: false });
      }
    }
  }

  calculateDailyRate() {
    const expenses = this.missionForm.get('missionExpenses')?.value || 0;
    const days = this.missionForm.get('numberOfDays')?.value || 0;

    if (days > 0) {
      this.dailyRate = expenses / days;
    } else {
      this.dailyRate = 0;
    }
  }

  autoFillDays() {
    if (this.calculatedDays > 0) {
      this.missionForm.get('numberOfDays')?.setValue(this.calculatedDays);
      this.toastrService.info(`Number of days set to ${this.calculatedDays}`, 'Auto-filled');
    }
  }

  get form() {
    return this.missionForm.controls;
  }

  async createOrUpdateMission() {
    this.isSubmitted = true;

    if (this.missionForm.valid) {
      try {
        if (this.missionToUpdate) {
          // Update
          const updateDto: MissionUpdateDTO = {
            missionId: this.form['missionId'].value,
            title: this.form['title'].value,
            description: this.form['description'].value,
            startDate: this.form['startDate'].value,
            endDate: this.form['endDate'].value,
            destination: this.form['destination'].value,
            missionExpenses: this.form['missionExpenses'].value,
            paymentMode: this.form['paymentMode'].value,
            status: this.form['status'].value,
            numberOfDays: this.form['numberOfDays'].value,
            notes: this.form['notes'].value
          };

          await firstValueFrom(
            this.missionService.missionControllerUpdateMission(
              updateDto.missionId!,
              updateDto
            )
          );

          this.toastrService.success('Mission updated successfully', 'Success');
        } else {
          // Create
          const createDto: MissionCreateDTO = {
            title: this.form['title'].value,
            description: this.form['description'].value,
            startDate: this.form['startDate'].value,
            endDate: this.form['endDate'].value,
            destination: this.form['destination'].value,
            missionExpenses: this.form['missionExpenses'].value,
            paymentMode: this.form['paymentMode'].value,
            status: this.form['status'].value,
            numberOfDays: this.form['numberOfDays'].value,
            notes: this.form['notes'].value,
            employeeId: this.form['employeeId'].value
          };

          await firstValueFrom(
            this.missionService.missionControllerCreateMission(createDto)
          );

          this.toastrService.success('Mission created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.missionSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save mission',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.missionForm = this.formBuilder.group({
      missionId: [0],
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      employeeId: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      destination: ['', Validators.maxLength(200)],
      missionExpenses: [0, [Validators.required, Validators.min(0)]],
      paymentMode: [0, Validators.required],
      status: [0, Validators.required],
      numberOfDays: [0, [Validators.required, Validators.min(1), Validators.max(365)]],
      notes: ['', Validators.maxLength(500)]
    });
  }

  initEditForm(mission: MissionModel) {
    this.missionForm = this.formBuilder.group({
      missionId: [mission.missionId],
      title: [mission.title, [Validators.required, Validators.maxLength(200)]],
      description: [mission.description, [Validators.required, Validators.maxLength(1000)]],
      employeeId: [{ value: mission.employeeId, disabled: true }],
      startDate: [
        mission.startDate ? new Date(mission.startDate).toISOString().split('T')[0] : '',
        Validators.required
      ],
      endDate: [
        mission.endDate ? new Date(mission.endDate).toISOString().split('T')[0] : '',
        Validators.required
      ],
      destination: [mission.destination, Validators.maxLength(200)],
      missionExpenses: [mission.missionExpenses, [Validators.required, Validators.min(0)]],
      paymentMode: [mission.paymentMode, Validators.required],
      status: [mission.status, Validators.required],
      numberOfDays: [mission.numberOfDays, [Validators.required, Validators.min(1), Validators.max(365)]],
      notes: [mission.notes, Validators.maxLength(500)]
    });

    // Calculer les valeurs initiales
    this.calculateDays();
    this.calculateDailyRate();
  } 

  closePopup() {
    closeModal("mission-create-form");
    this.isSubmitted = false;
    this.calculatedDays = 0;
    this.dailyRate = 0;
    this.initCreateForm();
  }
}