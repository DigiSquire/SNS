import {  Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import {  catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import {  AngularFireAuth } from 'angularfire2/auth';
import {  environment } from '../../environments/environment';
import {  BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/switchMap'
import {  NotifyService } from './notify.service';

import {  HttpClient } from '@angular/common/http';
import {  HttpHeaders } from '@angular/common/http';
import {  HttpErrorHandler,  HandleError } from './http-error-handler.service';
import { first } from 'rxjs/operators';
interface Error {
  code: string;
  message: string;
}
interface User {
  uid: string;
  email: string;
  photoURL ?: string;
  displayName ?: string;
  favoriteColor ?: string;
  msg ?: string;
  success ?: boolean;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private messageSource = new BehaviorSubject < boolean > (false);
  isLoading = this.messageSource.asObservable();

  userRole = new BehaviorSubject <string> (null);
  loggedInUserRole = this.userRole.asObservable();

  permissionMsg = new BehaviorSubject<string>(null);

  private email = new BehaviorSubject<string>(null);
  getEmail = this.email.asObservable();

  private userRegisterURL = `${ environment.API_BASE_URI }/user/register`; // URL to web api
  private handleHTTPError: HandleError;
  user: Promise <User> ;


  constructor(private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router, private notify: NotifyService, httpErrorHandler: HttpErrorHandler) {
    this.changeMessage(true);
    this.handleHTTPError = httpErrorHandler.createHandleError('AuthService');
    // this.user = this.afAuth.authState
    //   .switchMap(user => {
    //     this.changeMessage(false);
    //     if (user) {
    //       this.changeMessage(false);
    //       sessionStorage.setItem(environment.emailId, user.email);
    //       // this.userSource.next(user.email);
    //       console.log('user generated');
    //       return this.afAuth.authState;
    //     } else {
    //       // logged out, null
    //       return Observable.of(null);
    //     }
    //   })
    this.checkLoginStreamRole();
  }
  
  changeMessage(isLoading: boolean) {
    this.messageSource.next(isLoading)
  }

  emailSignUp(email: string, password: string, firstName: string, lastName: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        return credential.user.getIdToken(true)
      }).then((idToken) => {
        const userData = {
          'idToken': idToken,
          'firstName': firstName,
          'lastName': lastName
        }
        return this.registerNewUser(userData).subscribe((result => {
          console.log(result);
          if (result.success === true) {            
            this.checkRoleRedirect();
          } else {
            this.signOut('unAuthenticated');
            this.changeMessage(false);
          }
        }));
      })
        
      .catch(error => {
        this.handleError(error);
        this.changeMessage(false);
      });
  }
  
isLoggedIn() {
  return this.afAuth.authState.pipe(first()).toPromise();
}

async checkLoginStreamRole() {
  const user = await this.isLoggedIn()
  if (user) {
    const idTokenResult = await this.afAuth.auth.currentUser.getIdTokenResult(true);
    if (!!idTokenResult.claims.artist) {
      if (this.email.getValue() === null) {
        this.email.next(user.email)
      }
      // Show artist user UI.
      this.userRole.next('artist');
      this.changeMessage(false);
    } else if (!!idTokenResult.claims.admin) {
      // Show admin UI.    
      this.userRole.next('admin');
      this.changeMessage(false);
    }
  } else {
    this.changeMessage(false);
    return null;
  }
}
checkLoginAndRole(route: String): Promise<boolean> {
  return new Promise((resolve, reject) => {
    return this.isLoggedIn().then((user) => {
      if (user) {
        // sessionStorage.setItem(environment.emailId, user.email);
        return this.afAuth.auth.currentUser.getIdTokenResult(true).then((idTokenResult) => {
          if (!!idTokenResult.claims.artist && route.indexOf(environment.role_admin) === -1) {            
              if (this.email.getValue() === null) {
                this.email.next(user.email)
              }
            // Show artist user UI.
            this.userRole.next('artist');
            this.changeMessage(false);
            resolve(true)
          } else if (!!idTokenResult.claims.admin && route.indexOf(environment.role_artist) === -1) {
            // Show admin UI.    
            this.userRole.next('admin');
            this.changeMessage(false);
            resolve(true)
          }else {
            this.permissionMsg.next('You do not have the access permission');
            this.changeMessage(false);
            resolve(false)
          }
        });
        
      }else {
        this.changeMessage(false);
        resolve(false)
      }
    }), (error) => {
      console.error('error in checkLoginAndRole : ', error);
      reject(error);
    }
  });    
}

  checkRoleRedirect= () => {
    this.afAuth.auth.currentUser.getIdTokenResult(true)
      .then((idTokenResult) => {
        // Confirm the user is an Artist.
        if (!!idTokenResult.claims.artist) {
          // Show artist user UI.
          this.userRole.next('artist');
          this.router.navigate(['./artist-center']);
          this.notify.update('Welcome To Spaces & Stories Artist Center', 'welcome');
        } else if (!!idTokenResult.claims.admin) {
          // Show admin UI.      
          this.userRole.next('admin');
          this.router.navigate(['./admin-center']);
          this.notify.update('Welcome To Spaces & Stories Admin Center', 'welcome');
        }else {
          this.router.navigate(['./login']);
          this.notify.update('An error occurred  while login, please try again', 'error');
          this.signOut('unAuthenticated');
        }
      })
      .catch((error) => {
        this.handleError(error);
        this.changeMessage(false);
      });
  }
  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {        
        this.checkRoleRedirect();
      })
      .catch(error => {
        this.handleError(error);
        this.changeMessage(false);
      });
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() => this.notify.update('Reset requested. Check your email for instructions.', 'info'))
      .catch(error => this.handleError(error));
  }
  // If error, console log and notify user
  private handleError(error: Error) {
    if (error.code === environment.invalidUser) {
      this.notify.update('Please enter a valid email-id / password to continue', 'error');
    } else if (error.code === environment.wrongCredentials) {
      this.notify.update('Please enter valid authorization credentials', 'error');
    } else {
      this.notify.update(error.message, 'error');
    }

  }
  private registerNewUser(userData) {
    return this.http.post<User>(this.userRegisterURL, userData, httpOptions).pipe(
      catchError(this.handleHTTPError('registerNewUser'))
    );
  }
  signOut(isAuthenticated) {
    this.afAuth.auth.signOut().then(() => {
      // Reset Role and email id saved
      this.userRole.next(null);
      this.email.next(null);
      console.log('clearing session storage');
      sessionStorage.clear();

      this.router.navigate(['/']);
      isAuthenticated === 'unAuthenticated' ?
        this.notify.update('There was an error during sign up, please try again.', 'error') :
        this.notify.update('You Have Been Successfully Logged-Out', 'success');

    });
  }
}
