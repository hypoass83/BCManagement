import { Injectable, signal } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { ActionMenuProfileModel, CreateOrUpdateProfileRequest, ProfileModel } from "src/app/generated";
import { ProfileService } from '../../generated/api/profile.service';
import { Router } from "@angular/router";


@Injectable()

export default class SecurityProfileService{

  profileList = signal<ProfileModel[]>([]);


  constructor(private profileService:ProfileService,private router:Router){
  }

  getProfileList() {
    this.profileService.profileControllerGetAllProfileById()
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Failed to get profiles', error));
        })
      ).subscribe(profiles => {
        this.profileList.set(profiles)
      });
  }

  getActionProfileByPath (path:string):Observable<ActionMenuProfileModel> {
    return this.profileService.profileControllerGetActionByPath(path);
  }

  createOrUpdateProfile(request:CreateOrUpdateProfileRequest){
    if(request.profile?.profileID==0){
      this.profileService.profileControllerCreateProfile(request)
      .pipe(
        catchError(error => {
          return throwError(() => new Error('Failed to get actions', error));
        })
      )
      .subscribe(p=>{
       this.profileList.update(current=>[...current,p])
       this.router.navigate(["/admin/profile/base"])
      })
    }else{
      this.profileService.profileControllerUpdateProfile(request).subscribe(p=>{
        this.profileList.update(current=>current.map(pro=>(pro.profileID==request.profile?.profileID)?p:pro))
        this.router.navigate(["/admin/profile/base"])
       })
    }

  }

  deleteProfile(profileID:number){
    this.profileService.profileControllerDeleteProfile(profileID).subscribe(p=>{
      this.profileList.update(current=>current.filter(pro=>pro.profileID!=profileID))

    })
  }

}

