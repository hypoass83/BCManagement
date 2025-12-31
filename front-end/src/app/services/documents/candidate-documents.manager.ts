import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  CandidateDocumentsService,
  SearchCandidateDocumentsRequest
} from 'src/app/generated';

import { PagedResult } from 'src/app/models/paged-result';
import { CandidateDocumentDto } from 'src/app/models/candidate-document.dto';
import { HttpContext, HttpResponse } from '@angular/common/http';
import { SKIP_CONFIRM } from 'src/app/helper/interceptors/skip-confirm.token';

@Injectable({ providedIn: 'root' })
export class CandidateDocumentsManager {

  constructor(
    private api: CandidateDocumentsService
  ) {}

  // 🔍 Recherche paginée (AG-Grid infinite)
 /* search( request: SearchCandidateDocumentsRequest): Observable<PagedResult<CandidateDocumentDto>> {
    return this.api.candidateDocumentsControllerSearch(request) as Observable<PagedResult<CandidateDocumentDto>>;
  }*/

  search( request: SearchCandidateDocumentsRequest ): Observable<PagedResult<CandidateDocumentDto>> {

  return this.api.candidateDocumentsControllerSearch(
    request,
    'body',
    false,
    {
      context: new HttpContext().set(SKIP_CONFIRM, true)
    }
  ) as Observable<PagedResult<CandidateDocumentDto>>;
}
// 📄 GET PDF (AUTHORIZED, BLOB SAFE)

  getDocumentFile(id: number): Observable<Blob> {
    return this.api.candidateDocumentsControllerGetFile(
      id,
      'response',
      false,
      {
        httpHeaderAccept: 'application/pdf' // ⭐ CLÉ ICI
      }as any   // ✅ CAST INTENTIONNEL (BUG GEN-API)
    ).pipe(
      map((res: HttpResponse<any>) => res.body as Blob)
    );
  }

  // ✅ Récupération du PDF (Blob)
  getFile(id: number): Observable<Blob> {
  return this.api.candidateDocumentsControllerGetFile(
    id,
    'body',
    false,
    { httpHeaderAccept: 'application/pdf' } as any
  ) as Observable<Blob>;
}
/*
this.docsFacade.autoFill(documentId).subscribe(dto => {
  this.form.patchValue({
    candidateName: dto.candidateName,
    candidateNumber: dto.candidateNumber,
    centreCode: dto.centreCode
  });

  if (dto.isConfidenceLow) {
    this.snackBar.open(
      'Please verify extracted data',
      'OK',
      { duration: 4000 }
    );
  }
});
*/
  
}
