import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

import { NotifyService } from './notify.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*',
  })
};
@Injectable()
export class ArtworkService {
  readonly uploadURL = `${ environment.API_BASE_URI }/art/upload`;

  private handleHTTPError: HandleError;
  constructor(private http: HttpClient, private notify: NotifyService, httpErrorHandler: HttpErrorHandler) { 
    this.handleHTTPError = httpErrorHandler.createHandleError('ArtWorkService');
  }
  getProfile = (email) => {
    const url = `${environment.API_BASE_URI_LOCAL}/user/${email}`;
    return this.http.get(url).pipe(
      map(result => {
        if (!result) {
          this.notify.update('There Was An Error Getting Your Profile Info', 'error');
        } else {
          return result;
        }
      }),
      catchError(this.handleHTTPError('getProfile'))
    );
  }
  updateProfile = (profileData) => {
    const id = sessionStorage.getItem(environment.id);
    if ( id != null) {
      const url = `${environment.API_BASE_URI_LOCAL}/user/updateProfile/${id}`
      console.log(profileData);
      return this.http.put<any>(url, profileData, httpOptions).pipe(
        map(result => {
          if (!result) {
            this.notify.update('There was an error updating your profile, please try again', 'error');
          } else {
            this.notify.update(`Profile updated successfully for : ${result.data.firstname} ${result.data.lastname}`, 'success');
            return result;
          }
        }),
        catchError(this.handleHTTPError('updateProfile'))
      );
    }else {
      this.notify.update('There was an error updating your profile, userID missing, please try again', 'error');
    }
    
  }
  uploadArtwork = (formData) => {
    console.log(formData);
    return this.http.post<any>(this.uploadURL, formData, httpOptions).pipe(
      map(result => {
        if (!result) {
          this.notify.update('There Was An Error Uploading Your Artwork', 'error');
        } else {
          this.notify.update(`Image: ${result.file.originalname} Uploaded Successfully`, 'success');
          return result.file.originalname;
        }
      }),
      catchError(this.handleHTTPError('uploadArtwork'))
    );
  }
  
}
