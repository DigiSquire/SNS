import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private notify: NotifyService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      console.log(state.url);
      return this.authorize(state.url);
  }
  authorize(attemptedPath: String): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.auth.checkLoginAndRole(attemptedPath)
      .then((hasAccess) => {        
        if (hasAccess) {
          this.router.navigate(['./gallery']);          
          resolve(false);
        }else {      
          resolve(true);
        }
      }, (error) => {
        this.notify.update('There was an error during navigation', 'error');
        this.router.navigate(['/login']);       
        reject(error);
      })    
    })    
  }
}
