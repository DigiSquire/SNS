import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from '@angular/fire/auth';
import { NotifyService } from './notify.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordAuthGuard implements CanActivate {
  activatedRouteParams;
  constructor(private router: Router, 
    private notify: NotifyService,
    private afAuth: AngularFireAuth,
    private location: Location) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {

    const actionCode = this.location.path().split('=')[2];    
    if (actionCode === undefined) {
      return this.authorize(undefined);
    }
    return this.authorize(actionCode.substring(0, actionCode.indexOf('&')));
  }
  authorize(actionCode: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (actionCode !== undefined) {
        this.afAuth.auth.verifyPasswordResetCode(actionCode).then((email) => {
          this.notify.update('Please reset your password', 'success');
          resolve(true);
        }, (error) => {
          this.notify.update('The email link has expired, please try again', 'error');
            this.router.navigate(['./login']);
          resolve(false);
        });
      } else {
        this.router.navigate(['./login']);
        resolve(false);
      }
    }) 
  }
}
