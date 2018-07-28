import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

import { NotifyService } from './notify.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*',
  })
};
@Injectable()
export class ArtworkService {
  // private uploadURL = `${ environment.API_BASE_URI }/art/upload`;
  readonly uploadURL = 'https://sns-api-207407.appspot.com/api/art/upload';
  private handleHTTPError: HandleError;
  constructor(private http: HttpClient, private notify: NotifyService, httpErrorHandler: HttpErrorHandler) { 
    this.handleHTTPError = httpErrorHandler.createHandleError('ArtWorkService');
  }
  uploadArtwork(formData) {
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
