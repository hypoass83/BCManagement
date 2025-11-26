import { ToastrService } from 'ngx-toastr';
import { Injectable, signal } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {  BranchModel, BranchService } from 'src/app/generated';

@Injectable({
  providedIn: 'root'
})
export class BranchManagerService {
  branchList=signal<BranchModel[]>([])

  constructor(private branchService: BranchService, private toastrService: ToastrService) {
      this.refreshBranchList()
  }

  refreshBranchList(): void {
    this.branchService.branchControllerGetAllBranchs().pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to get Branchs', error));
      })
    ).subscribe(branchs => {
      this.branchList.update(()=>branchs)
    });
  }

  addBranch(Branch: BranchModel): void {
    this.branchService.branchControllerCreateBranch(Branch).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to add Branch', error));
      })
    ).subscribe(createdBranch => {
      this.branchList.update((current)=>[...current,createdBranch])
      this.closeModal();
      this.toastrService.success("Added successfuly")
    });
  }

  updateBranch(Branch: BranchModel): void {

    this.branchService.branchControllerUpdateBranch(Branch).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to update Branch', error));
      })
    ).subscribe(updatedBranch => {
        this.branchList.update((current)=>current.map(e=> (e.branchID==updatedBranch.branchID)?updatedBranch:e ))
        this.closeModal();
        this.toastrService.success("update successfuly")

    });
  }

  deleteBranch(id: number): void {
    this.branchService.branchControllerDeleteBranch(id).pipe(
      catchError(error => {
        return throwError(() => new Error('Failed to delete Branch', error));
      })
    ).subscribe(() => {
      this.branchList.update((current)=>current.filter(e=>e.branchID!=id))

      this.toastrService.success("deleted successfuly")
    });
  }


  closeModal() {
    const modal = document.getElementById('branch-create-form');
    if (modal) {
      modal.classList.toggle('hidden');
      const backdrop = document.querySelectorAll('[data-hs-overlay-backdrop-template]');

      // Iterate through the NodeList and remove each element from the DOM
      backdrop.forEach(element => {
        element.parentNode?.removeChild(element);
      });
    }
  }
}
