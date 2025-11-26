import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LeaveModel,
  LeaveCreateDTO,
  LeaveUpdateDTO,
  LeaveService,
  EmployeeService,
  EmployeeModel,
  LeaveTypeService,
  LeaveTypeModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.scss'],
})
export class LeaveFormComponent implements OnInit, OnChanges {

  @Input() leaveToUpdate: LeaveModel | null = null;
  @Output() leaveSaved = new EventEmitter<void>();

  public leaveForm!: FormGroup;
  public employees: EmployeeModel[] = [];
  public leaveTypes: LeaveTypeModel[] = [];
  public isSubmitted = false;

  // Leave status options
  public leaveStatusOptions = [
    { label: 'En attente', value: 0, icon: 'ti-clock', color: 'warning' },
    { label: 'Approuvé', value: 1, icon: 'ti-check', color: 'success' },
    { label: 'Rejeté', value: 2, icon: 'ti-x', color: 'danger' },
    { label: 'Annulé', value: 3, icon: 'ti-ban', color: 'secondary' }
  ];

  // Calculated fields
  public calculatedDays: number = 0;
  public selectedLeaveType: LeaveTypeModel | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private leaveService: LeaveService,
    private employeeService: EmployeeService,
    private leaveTypeService: LeaveTypeService,
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

      // Charger les types de congé
      this.leaveTypes = await firstValueFrom(
        this.leaveTypeService.leaveTypeControllerGetAllLeaveTypes()
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
    if (this.leaveToUpdate) {
      this.initEditForm(this.leaveToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  setupFormListeners() {
    // Calculer automatiquement le nombre de jours
    this.leaveForm.get('startDate')?.valueChanges.subscribe(() => this.calculateDays());
    this.leaveForm.get('endDate')?.valueChanges.subscribe(() => this.calculateDays());

    // Auto-remplir depuis LeaveType
    this.leaveForm.get('leaveTypeId')?.valueChanges.subscribe((leaveTypeId) => {
      this.onLeaveTypeChange(leaveTypeId);
    });
  }

  onLeaveTypeChange(leaveTypeId: number) {
    const leaveType = this.leaveTypes.find(lt => lt.leaveTypeID === leaveTypeId);

    if (leaveType) {
      this.selectedLeaveType = leaveType;

      // Auto-remplir IsPaid depuis LeaveType
      this.leaveForm.get('isPaid')?.setValue(leaveType.isPaid, { emitEvent: false });

      // Auto-remplir NumberOfDays avec DefaultDurationDays
      if (leaveType.defaultDurationDays && leaveType.defaultDurationDays > 0) {
        this.leaveForm.get('numberOfDays')?.setValue(leaveType.defaultDurationDays, { emitEvent: false });
      }

      this.toastrService.info(
        `Leave type "${leaveType.name}" selected. Fields auto-filled.`,
        'Auto-fill'
      );
    }
  }

  calculateDays() {
    const startDate = this.leaveForm.get('startDate')?.value;
    const endDate = this.leaveForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      this.calculatedDays = diffDays;

      // Auto-remplir numberOfDays si vide ou si on n'a pas de LeaveType sélectionné
      if (!this.leaveForm.get('numberOfDays')?.value || this.leaveForm.get('numberOfDays')?.value === 0) {
        this.leaveForm.get('numberOfDays')?.setValue(diffDays, { emitEvent: false });
      }
    }
  }

  autoFillDays() {
    if (this.calculatedDays > 0) {
      this.leaveForm.get('numberOfDays')?.setValue(this.calculatedDays);
      this.toastrService.info(`Number of days set to ${this.calculatedDays}`, 'Auto-filled');
    }
  }

  get form() {
    return this.leaveForm.controls;
  }

  async createOrUpdateLeave() {
    this.isSubmitted = true;

    if (this.leaveForm.valid) {
      try {
        if (this.leaveToUpdate) {
          // Update
          const updateDto: LeaveUpdateDTO = {
            leaveId: this.form['leaveId'].value,
            leaveTypeId: this.form['leaveTypeId'].value,
            startDate: this.form['startDate'].value,
            endDate: this.form['endDate'].value,
            numberOfDays: this.form['numberOfDays'].value,
            isPaid: this.form['isPaid'].value,
            reason: this.form['reason'].value,
            justificationPath: this.form['justificationPath'].value,
            status: this.form['status'].value
          };

          await firstValueFrom(
            this.leaveService.leaveControllerUpdateLeave(
              updateDto.leaveId!,
              updateDto
            )
          );

          this.toastrService.success('Leave request updated successfully', 'Success');
        } else {
          // Create
          const createDto: LeaveCreateDTO = {
            leaveTypeId: this.form['leaveTypeId'].value,
            startDate: this.form['startDate'].value,
            endDate: this.form['endDate'].value,
            numberOfDays: this.form['numberOfDays'].value,
            isPaid: this.form['isPaid'].value,
            reason: this.form['reason'].value,
            justificationPath: this.form['justificationPath'].value,
            status: this.form['status'].value,
            employeeId: this.form['employeeId'].value
          };

          await firstValueFrom(
            this.leaveService.leaveControllerCreateLeave(createDto)
          );

          this.toastrService.success('Leave request created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.leaveSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save leave request',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.leaveForm = this.formBuilder.group({
      leaveId: [0],
      leaveTypeId: [null, Validators.required],
      employeeId: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      numberOfDays: [0, [Validators.required, Validators.min(1), Validators.max(365)]],
      isPaid: [false],
      reason: ['', [Validators.required, Validators.maxLength(500)]],
      justificationPath: ['', Validators.maxLength(500)],
      status: [0, Validators.required]
    });
  }

  initEditForm(leave: LeaveModel) {
    this.selectedLeaveType = leave.leaveType || null;

    this.leaveForm = this.formBuilder.group({
      leaveId: [leave.leaveId],
      leaveTypeId: [leave.leaveTypeId, Validators.required],
      employeeId: [{ value: leave.employeeId, disabled: true }],
      startDate: [
        leave.startDate ? new Date(leave.startDate).toISOString().split('T')[0] : '',
        Validators.required
      ],
      endDate: [
        leave.endDate ? new Date(leave.endDate).toISOString().split('T')[0] : '',
        Validators.required
      ],
      numberOfDays: [leave.numberOfDays, [Validators.required, Validators.min(1), Validators.max(365)]],
      isPaid: [leave.isPaid],
      reason: [leave.reason, [Validators.required, Validators.maxLength(500)]],
      justificationPath: [leave.justificationPath, Validators.maxLength(500)],
      status: [leave.status, Validators.required]
    });

    // Calculer les valeurs initiales
    this.calculateDays();
  }

  closePopup() {
    closeModal("leave-create-form");
    this.isSubmitted = false;
    this.calculatedDays = 0;
    this.selectedLeaveType = null;
    this.initCreateForm();
  }
}
