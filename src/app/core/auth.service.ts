import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/switchMap'
import { NotifyService } from './notify.service';

import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
interface Files {
  filename: string;
  contentType: string;
  metadata: Array<any>[]
}
interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  msg?: string;
  success?: boolean;
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
  private messageSource = new BehaviorSubject<boolean>(false);
  isLoading = this.messageSource.asObservable();
  // private userRegisterURL = `${ environment.API_BASE_URI }/users/register`;  // URL to web api
  private userRegisterURL = `https://sns-api-207407.appspot.com/api/user/register`;  // URL to web api
  private handleHTTPError: HandleError;
  user: Observable<User>;

  // If needed inculde in constructor to access firestore 'private afs: AngularFirestore'
  
  constructor(private afAuth: AngularFireAuth,
    private http: HttpClient,
    private router: Router, private notify: NotifyService, httpErrorHandler: HttpErrorHandler) {
    this.handleHTTPError = httpErrorHandler.createHandleError('AuthService');

    //// Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user => {
        console.log('from auth state');
        if (user) {
          console.log('user generated');
          // logged in, get custom user from Firestore
          // return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
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
  // emailSignUp(email: string, password: string) {
  //   return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  //     .then(user => {
  //       return this.setUserDoc(user) // create initial user document
  //     })
  //     .catch(error => this.handleError(error));
  // }


  // googleLogin() {
  //   const provider = new firebase.auth.GoogleAuthProvider()
  //   return this.oAuthLogin(provider);
  // }
  // facebookLogin() {
  //   const provider = new firebase.auth.FacebookAuthProvider();
  //   return this.oAuthLogin(provider);
  // }
  // private oAuthLogin(provider: any) {
  //   return this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(credential => {
  //       alert('Welcome to SNS!!!');
  //       return this.updateUserData(credential.user);
  //     })
  //     .catch(error => this.handleError(error));
  // }

  //// Email/Password Auth ////
  
  emailSignUp(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(credential => {
         this.router.navigate(['/home']);
         this.changeMessage(false);
         this.notify.update('Welcome To Spaces & Stories', 'success');
          // return this.updateUserData(credential); // if using firestore
      })
      .catch(error => {
        this.handleError(error);
        this.changeMessage(false);
      });
  }
  // Update properties on the user document
  // updateUser(user: User, data: any) {
  //   return this.afs.doc(`users/${user.uid}`).update(data)
  // }
  
  // TODO : Solve the observable auth.user binding to template which flickers the login
  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        console.log(credential.user);
        return this.registerNewUser(credential.user).subscribe((result => {
          console.log(result);
          if (result.success === true) {            
            this.router.navigate(['/upload']);
            this.changeMessage(false);
          }else {
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
    console.error(error);
    this.notify.update(error.message, 'error');
  }
  private registerNewUser(user) {
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'nameless user',
      photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ',
      role: 'admin'
    }
    console.log(data);
    return this.http.post<User>(this.userRegisterURL, data, httpOptions).pipe(
      catchError(this.handleHTTPError('registerNewUser'))
    );
  }
  getimages() {
    const getImagesURL = `${environment.API_BASE_URI}/art/files`;
    return this.http.get<Files>(getImagesURL, httpOptions).pipe(
      catchError(this.handleHTTPError('getImages'))
    );
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
      this.notify.update('You Have Been Successfully Logged-Out', 'success');
    });
  }
}