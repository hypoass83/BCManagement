import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoanModel,
  LoanPaymentDTO,
  LoanService
} from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-loan-payment-form',
  templateUrl: './loan-payment-form.component.html',
  styleUrls: ['./loan-payment-form.component.scss'],
})
export class LoanPaymentFormComponent implements OnChanges {

  @Input() loan: LoanModel | null = null;
  @Output() paymentSaved = new EventEmitter<void>();

  public paymentForm!: FormGroup;
  public isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private loanService: LoanService,
    private toastrService: ToastrService
  ) {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.loan) {
      this.initForm();
    }
  }

  initForm() {
    this.paymentForm = this.formBuilder.group({
      paymentAmount: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(this.loan?.remainingBalance || 0)
        ]
      ],
      paymentDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  get form() {
    return this.paymentForm.controls;
  }

  async recordPayment() {
    this.isSubmitted = true;

    if (this.paymentForm.valid && this.loan) {
      try {
        const paymentDto: LoanPaymentDTO = {
          paymentAmount: this.form['paymentAmount'].value,
          paymentDate: this.form['paymentDate'].value
        };

        await firstValueFrom(
          this.loanService.loanControllerRecordPayment(
            this.loan.loanId!,
            paymentDto
          )
        );

        this.toastrService.success('Payment recorded successfully', 'Success');
        this.isSubmitted = false;
        this.paymentSaved.emit();
        this.closePopup();
      } catch (error: any) {
        this.toastrService.error(
          error?.error?.message || 'Failed to record payment',
          'Error'
        );
      }
    }
  }

  closePopup() {
    closeModal("loan-payment-form");
    this.isSubmitted = false;
    this.initForm();
  }

  formatCurrency(amount: number | undefined): string {
    if (!amount) return '0 XAF';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  }
}
