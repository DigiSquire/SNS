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
  role: string;
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*',
  })
};
@Injectable()
export class AuthService {
  private messageSource = new BehaviorSubject < boolean > (false);
  isLoading = this.messageSource.asObservable();
  // private userSource = new BehaviorSubject < any > (null);
  // loggedInUser = this.userSource.asObservable();
  private userRegisterURL = `${ environment.API_BASE_URI }/user/register`; // URL to web api
  private handleHTTPError: HandleError;
  user: Observable < User > ;

  // If needed include in constructor to access firestore 'private afs: AngularFirestore'

  constructor(private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router, private notify: NotifyService, httpErrorHandler: HttpErrorHandler) {
    this.changeMessage(true);
    this.handleHTTPError = httpErrorHandler.createHandleError('AuthService');

    // Get auth data, then get firestore user document || null
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
  }
  changeMessage(isLoading: boolean) {
    this.messageSource.next(isLoading)
  }

  emailSignUp(email: string, password: string, role: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
        return this.registerNewUser(credential.user, role).subscribe((result => {
          console.log(result);
          if (result.success === true) {
            this.changeMessage(false);
            this.router.navigate(['./artist-center']);
            this.notify.update('Welcome To Spaces & Stories', 'success');
          } else {
            this.user = Observable.of(null);
            this.changeMessage(false);
          }
        }));
      })
      .catch(error => {
        this.handleError(error);
        this.changeMessage(false);
      });
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['./artist-center']);
        this.notify.update('Welcome To Spaces & Stories', 'success');
        this.changeMessage(false);
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
  private registerNewUser(user, role ? ) {
    const data: User = {
      uid: user.uid,
      email: user.email,
      role: role
    }
    return this.http.post < User > (this.userRegisterURL, data, httpOptions).pipe(
      catchError(this.handleHTTPError('registerNewUser'))
    );
  }
  signOut(isAuthenticated) {
    this.afAuth.auth.signOut().then(() => {
      console.log('clearing session storage');
      sessionStorage.clear();
      this.router.navigate(['/']);
      isAuthenticated === 'unAuthenticated' ?
        this.notify.update('There was an error during sign up, please try gain.', 'error') :
        this.notify.update('You Have Been Successfully Logged-Out', 'success');

    });
  }
}
