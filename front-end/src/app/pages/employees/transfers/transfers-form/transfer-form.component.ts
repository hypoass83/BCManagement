import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  TransferModel,
  TransferCreateDTO,
  TransferUpdateDTO,
  TransferService,
  EmployeeService,
  BranchService,
  EmployeeModel,
  BranchModel
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transfer-form',
  templateUrl: './transfer-form.component.html',
  styleUrls: ['./transfer-form.component.scss'],
})
export class TransferFormComponent implements OnInit, OnChanges {

  @Input() transferToUpdate: TransferModel | null = null;
  @Output() transferSaved = new EventEmitter<void>();

  public transferForm!: FormGroup;
  public employees: EmployeeModel[] = [];
  public branches: BranchModel[] = [];
  public isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private transferService: TransferService,
    private employeeService: EmployeeService,
    private branchService: BranchService,
    private toastrService: ToastrService
  ) {
    this.initCreateForm();
  }

  async ngOnInit() {
    try {
      // Charger les employés et les branches
      [this.employees, this.branches] = await Promise.all([
        firstValueFrom(this.employeeService.employeeControllerGetAllEmployees()),
        firstValueFrom(this.branchService.branchControllerGetAllBranchs())
      ]);
    } catch (error: any) {
      this.toastrService.error(
        error?.error?.message || 'Failed to load data',
        'Error'
      );
    }
  }

  ngOnChanges(): void {
    if (this.transferToUpdate) {
      this.initEditForm(this.transferToUpdate);
    } else {
      this.initCreateForm();
    }
  }

  get form() {
    return this.transferForm.controls;
  }

  async createOrUpdateTransfer() {
    this.isSubmitted = true;

    if (this.transferForm.valid) {
      try {
        if (this.transferToUpdate) {
          // Update
          const updateDto: TransferUpdateDTO = {
            transferId: this.form['transferId'].value,
            transferDate: this.form['transferDate'].value,
            transferExpenses: this.form['transferExpenses'].value,
            reason: this.form['reason'].value
          };

          await firstValueFrom(
            this.transferService.transferControllerUpdateTransfer(
              updateDto.transferId!,
              updateDto
            )
          );

          this.toastrService.success('Transfer updated successfully', 'Success');
        } else {
          // Create
          const createDto: TransferCreateDTO = {
            employeeId: this.form['employeeId'].value,
            destinationBranchId: this.form['destinationBranchId'].value,
            transferDate: this.form['transferDate'].value,
            transferExpenses: this.form['transferExpenses'].value || 0,
            reason: this.form['reason'].value
          };

          await firstValueFrom(
            this.transferService.transferControllerCreateTransfer(createDto)
          );

          this.toastrService.success('Transfer created successfully', 'Success');
        }

        this.isSubmitted = false;
        this.transferSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to save transfer',
          'Error'
        );
      }
    }
  }

  initCreateForm() {
    this.transferForm = this.formBuilder.group({
      transferId: [0],
      employeeId: [null, Validators.required],
      destinationBranchId: [null, Validators.required],
      transferDate: [new Date().toISOString().split('T')[0], Validators.required],
      transferExpenses: [0, [Validators.min(0)]],
      reason: [null, Validators.maxLength(1000)]
    });
  }

  initEditForm(transfer: TransferModel) {
    this.transferForm = this.formBuilder.group({
      transferId: [transfer.transferId],
      employeeId: [{ value: transfer.employeeId, disabled: true }, Validators.required],
      destinationBranchId: [{ value: transfer.destinationBranchId, disabled: true }, Validators.required],
      transferDate: [
        transfer.transferDate ? new Date(transfer.transferDate).toISOString().split('T')[0] : null,
        Validators.required
      ],
      transferExpenses: [transfer.transferExpenses || 0, [Validators.min(0)]],
      reason: [transfer.reason, Validators.maxLength(1000)]
    });
  }

  closePopup() {
    closeModal("transfer-create-form");
    this.isSubmitted = false;
    this.initCreateForm();
  }
}
