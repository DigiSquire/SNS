import {  Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import {  catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import {  AngularFireAuth } from 'angularfire2/auth';
import {  environment } from '../../environments/environment';
import {  Observable } from 'rxjs/Observable';
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

  private userRole = new BehaviorSubject < string > (null);
  loggedInUserRole = this.userRole.asObservable();

  isUser = new BehaviorSubject<boolean>(false);
  isUserPresent = this.isUser.asObservable();

  private userRegisterURL = `${ environment.API_BASE_URI }/user/register`; // URL to web api
  private handleHTTPError: HandleError;
  user: Observable < User > ;

  // If needed include in constructor to access firestore 'private afs: AngularFirestore'

  constructor(private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router, private notify: NotifyService, httpErrorHandler: HttpErrorHandler) {
    this.changeMessage(true);
    this.handleHTTPError = httpErrorHandler.createHandleError('AuthService');
    this.user = this.afAuth.authState
      .switchMap(user => {
        this.changeMessage(false);
        if (user) {
          this.changeMessage(false);
          sessionStorage.setItem(environment.emailId, user.email);
          // this.userSource.next(user.email);
          console.log('user generated');
          return this.afAuth.authState;
        } else {
          // logged out, null
          return Observable.of(null);
        }
      })
    this.checkLoginStreamRole();
  }
  
  changeMessage(isLoading: boolean) {
    this.messageSource.next(isLoading)
  }

  emailSignUp(email: string, password: string, firstName: string, lastName: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        return credential.user.getIdToken()
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
    this.isUser.next(true);
    sessionStorage.setItem(environment.emailId, user.email);
    const idTokenResult = await this.afAuth.auth.currentUser.getIdTokenResult();
    if (!!idTokenResult.claims.artist) {
      // Show artist user UI.
      this.userRole.next('artist');
      this.changeMessage(false);
    } else if (!!idTokenResult.claims.admin) {
      // Show admin UI.    
      this.userRole.next('admin');
      this.changeMessage(false);
    }
  } else {
    // this.router.navigate(['./login']);
    // this.notify.update('An error occurred  while login, please try again', 'error');
    // this.signOut('unAuthenticated');
    this.changeMessage(false);
    return null;
  }
}
  checkRoleRedirect= () => {
    this.afAuth.auth.currentUser.getIdTokenResult(true)
      .then((idTokenResult) => {
        this.isUser.next(true);
        // Confirm the user is an Admin.
        if (!!idTokenResult.claims.artist) {
          // Show artist user UI.
          this.userRole.next('artist');
          this.router.navigate(['./artist-center']);
          this.notify.update('Welcome To Spaces & Stories Artist Center', 'success');
        } else if (!!idTokenResult.claims.admin) {
          // Show admin UI.      
          this.userRole.next('admin');
          this.router.navigate(['./admin-center']);
          this.notify.update('Welcome To Spaces & Stories Ar Center', 'success');
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
      .then(() => this.notify.update('Password update email sent', 'info'))
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
      this.isUser.next(null);
      this.userRole.next(null);
      console.log('clearing session storage');
      sessionStorage.clear();
      this.router.navigate(['/']);
      isAuthenticated === 'unAuthenticated' ?
        this.notify.update('There was an error during sign up, please try again.', 'error') :
        this.notify.update('You Have Been Successfully Logged-Out', 'success');

    });
  }
}
