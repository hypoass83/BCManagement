import {Component,   Inject,   OnChanges,   OnInit, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { CandidateDocumentEditDto } from 'src/app/models/candidate-document-edit.model';
import { ImportErrorsManager } from 'src/app/services/documents/import-errors.manager';
import { environment } from 'src/environments/environment';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface FixImportDialogData {
  errorId: number;
  context: {
    session: number;
    examCode: string;
    centreCode: string;
  };
}




@Component({
  selector: 'app-fix-import-error',
  templateUrl: './fix-import-error.component.html',
  styleUrls: ['./fix-import-error.component.scss']
})
export class FixImportErrorComponent implements OnInit {

  loading = true;
  saving = false;

  document!: CandidateDocumentEditDto;
  form!: FormGroup;

  apiBaseUrl = environment.apiUrl

  pdfUrl!: string;
  safePdfUrl: SafeResourceUrl | null = null;

  context!: {
    session: number;
    examCode: string;
    centreCode: string;
  };

  errorMessage: string | null = null;

  constructor(
  @Inject(MAT_DIALOG_DATA) public data: FixImportDialogData,
  private dialogRef: MatDialogRef<FixImportErrorComponent>,
  private fb: FormBuilder,
  private manager: ImportErrorsManager,
  private sanitizer: DomSanitizer
) {
    this.context = data.context;
  }

  get canForceCentreCorrection(): boolean {
  return (
    this.form &&
    this.form.value.centreCode &&
    this.context?.centreCode &&
    this.form.value.centreCode !== this.context.centreCode
  );
}


   ngOnInit(): void {
  this.form = this.fb.group({
    session: [''],
    examCode: [''],
    centreCode: [''],
    candidateNumber: [''],
    candidateName: [''],
    forceCentreCorrection: [false]
  });

  this.loadDetail();
  console.log('Context from parent:', this.context);
}

loadDetail(): void {
  this.loading = true;

  this.manager.getErrorDetail(this.data.errorId).subscribe({
    next: res => {
      this.document = res;

      const session =
        res.session ?? this.context.session;

      const examCode =
        res.examCode && res.examCode.trim() !== ''
          ? res.examCode
          : this.context.examCode;

      const centreCode =
        res.centreCode && res.centreCode.trim() !== ''
          ? res.centreCode
          : this.context.centreCode;

      const candidateNumber =
        res.candidateNumber && res.candidateNumber.trim() !== ''
          ? res.candidateNumber
          : this.context.centreCode; //  règle spéciale CIN

      const candidateName =
        res.candidateName && res.candidateName.trim() !== ''
          ? res.candidateName
          : '';

      this.form.patchValue({
        session,
        examCode,
        centreCode,
        candidateNumber,
        candidateName
      });

      this.pdfUrl = environment.apiUrl + res.pdfUrl;
      this.safePdfUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);

      this.loading = false;
    },
    error: () => (this.loading = false)
  });
}


submit(): void {
  if (this.form.invalid || this.saving) return;

  this.saving = true;
  this.errorMessage = null;

  const payload = {
    documentId: this.document.id,
    session: this.form.value.session,
    examCode: this.form.value.examCode,
    centreCode: this.form.value.centreCode,
    candidateNumber: this.form.value.candidateNumber,
    candidateName: this.form.value.candidateName,

    expectedSession: this.context.session,
    expectedExamCode: this.context.examCode,
    expectedCentreCode: this.context.centreCode,

    forceCentreCorrection: this.form.value.forceCentreCorrection
  };

  this.manager.fixImportError(payload).subscribe({
    next: () => {
      this.saving = false;
      this.dialogRef.close('fixed'); //  clé
    },
    error: (err) => {
      this.saving = false;

      //  MESSAGE BACKEND → UI
      this.errorMessage =
        err?.error?.message ?? 'Unable to fix the import error.';
    }
  });
}


 close(): void {
  this.dialogRef.close();
}

  

}
