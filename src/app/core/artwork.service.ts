import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

import { NotifyService } from './notify.service';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
import { AuthService } from './auth.service';
import { Files, UserProfile} from './result.interface';
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
  })
};
@Injectable({
  providedIn: 'root'
})
export class ArtworkService { 
  readonly uploadURL = `${environment.API_BASE_URI}/artist/upload`;
  private handleHTTPError: HandleError;
  constructor(private http: HttpClient,
      private notify: NotifyService,
      httpErrorHandler: HttpErrorHandler, private auth: AuthService) { 
      this.handleHTTPError = httpErrorHandler.createHandleError('ArtWorkService');
    
  }
  getArtworks(lastKey?) {
    const getImagesURL = `${environment.API_BASE_URI}/gallery/files`;
    let params;
    if (lastKey != null || lastKey !== '' && lastKey !== undefined) {
        params = new HttpParams()
        .set('last_id', lastKey);
    }    
    return this.http.get(getImagesURL, { params }).pipe(
      map(result => {
        if (!result) {
          this.notify.update('There was an error retrieving the artworks', 'error');
        } else {
          return result;
        }
      }),
      catchError(this.handleHTTPError('getArtworks'))
    );
  }
  getProfile = (email) => {
    const url = `${environment.API_BASE_URI}/user/${email}`;
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
    this.auth.changeMessage(true);
    if (this.auth.getUserProfileData()._id != null) {
      const url = `${environment.API_BASE_URI}/user/updateProfile/${this.auth.getUserProfileData()._id}`
      console.log(profileData);
      return this.http.put<any>(url, profileData, httpOptions).pipe(
        map(result => {
          if (!result) {
            this.auth.changeMessage(false);
            this.notify.update('There was an error updating your profile, please try again', 'error');
          } else {
            this.auth.changeMessage(false);
            this.notify.update(`Profile updated successfully`, 'success');
            return result;
          }
        }),
        catchError(this.handleHTTPError('updateProfile'))
      );
    }else {
      this.auth.changeMessage(false);
      this.notify.update('There was an error updating your profile, userID missing, please try again', 'error');
    }
    
  }
  uploadArtwork = (payload) => {
    console.log('payload to service call', payload);
    return this.http.post<any>(this.uploadURL, payload, httpOptions).pipe(
      map(result => {
        if (!result) {
          this.auth.changeMessage(false);
          this.notify.update('There Was An Error Uploading Your Artwork', 'error');
        } else {
          this.auth.changeMessage(false);
          this.notify.update(`${result.message}`, 'success');
          return true;
        }
      }),
      catchError(this.handleHTTPError('uploadArtwork'))
    );
  }
  getUserArtworks(emailID, lastKey?) {
    const email = emailID
    let params;
    if (lastKey != null || lastKey !== '' && lastKey !== undefined) {
      params = new HttpParams()
        .set('last_id', lastKey);
    } 
    if (email != null) {
      const getImagesURL = `${environment.API_BASE_URI}/artist/files/${email}`;
      return this.http.get<Files>(getImagesURL, { params }).pipe(
        map(result => {
          if (!result) {
            this.notify.update('There was an error retrieving the artworks', 'error');
          } else {
            return result;
          }
        }),
        catchError(this.handleHTTPError('getUserArtworks'))
      );
    }else {
      this.notify.update('There was an error retrieving your artworks, email missing, please try again', 'error');
    }
    
  }
  
}
