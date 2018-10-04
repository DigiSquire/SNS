import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';
import 'rxjs/add/operator/do';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private notify: NotifyService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log(state.url);
      return this.authorize(state.url);
    // return this.auth.user
    //   .take(1)
    //   .map((user) => !!user)
    //   .do(loggedIn => {
    //     if (!loggedIn) {
    //       this.notify.update('Login to continue', 'error');
    //       this.router.navigate(['/login']);
    //     }
    //   });
  }
  authorize(attemptedPath: String): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.checkLoginAndRole(attemptedPath)
      .then((hasAccess) => {        
        if (hasAccess) {          
          resolve(true);
        }else {
          if (this.auth.permissionMsg.getValue()) {
            this.notify.update(this.auth.permissionMsg.getValue(), 'error');
            // route to previous url
            this.router.navigate(['./gallery']); 
          }else {
            this.notify.update('Login to continue', 'error');          
            this.router.navigate(['./login']); 
          }          
          resolve(false);
        }
      }, (error) => {
        this.notify.update('There was an error during authentication', 'error');
        this.router.navigate(['/login']);       
        reject(error);
      })    
    })    
  }
}
