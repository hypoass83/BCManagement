import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserCreateDTO, UserModel, UserService } from 'src/app/generated';
import { closeModal } from 'src/app/helper/helper-function';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
  private userList: UserModel[] = [];
  userListSubject = new Subject<UserModel[]>();

  constructor(private userService: UserService, private toastrService: ToastrService) {

  }

  emitUserList(): void {
    this.userListSubject.next(this.userList.slice());
  }

  refreshUserList(): void {
    this.userService.userControllerGetUsersWithLowerAccessLevel().pipe(
      catchError(error => {
        this.userListSubject.error(error);
        return throwError(() => new Error('Failed to get users', error));
      })
    ).subscribe(users => {
      this.userList = users.filter(u => u.isConnected);
      this.emitUserList();
    });
  }

  addUser(user: UserCreateDTO): void {
    this.userService.userControllerCreateUser(user).pipe(
      catchError(error => {
        this.userListSubject.error(error);
        return throwError(() => new Error('Failed to add user', error));
      })
    ).subscribe(createdUser => {
      if (createdUser.isConnected) {
        this.userList.push(createdUser);
        this.emitUserList();

        this.toastrService.success("User Added successfuly")
      }else{
        this.toastrService.warning("a Non  User was Added successfuly, non user are not in this list")
      }

      this.closePopup();

    });
  }

  updateUser(user: UserCreateDTO): void {
    this.userService.userControllerUpdateUser(user).pipe(
      catchError(error => {
        this.userListSubject.error(error);
        return throwError(() => new Error('Failed to update user', error));
      })
    ).subscribe(updatedUser => {
      const index = this.userList.findIndex(u => u.globalPersonID === updatedUser.globalPersonID);
      if (index !== -1) {
        this.userList[index] = updatedUser;
        this.emitUserList();
        this.closePopup();
        this.toastrService.success("Added successfuly")
      }
    });
  }

  deleteUser(id: number): void {
    this.userService.userControllerDeleteUser(id).pipe(
      catchError(error => {
        this.userListSubject.error(error);

        return throwError(() => new Error('Failed to delete user', error));
      })
    ).subscribe(() => {
      this.userList = this.userList.filter(user => user.globalPersonID !== id);

      this.toastrService.success("deleted successfuly")
      this.emitUserList();
      this.emitUserList();
    });
  }


  closePopup() {
    closeModal("user-create-form")
  }
}
