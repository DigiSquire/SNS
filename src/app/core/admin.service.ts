import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

import { NotifyService } from './notify.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*',
  })
};
export interface Files {
  filename: string;
  contentType: string;
  metadata: Array<Object>;
}
@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly uploadURL = `${environment.API_BASE_URI}/art/upload`;

  private handleHTTPError: HandleError;
  constructor(private http: HttpClient, private notify: NotifyService, httpErrorHandler: HttpErrorHandler) {
    this.handleHTTPError = httpErrorHandler.createHandleError('AdminService');
  }
  getPendingArtworks = (approvalStatus) => {
    const getImagesURL = `${environment.API_BASE_URI_LOCAL}/art/admin/${approvalStatus}`;
      return this.http.get<Files>(getImagesURL, httpOptions).pipe(
        map(result => {
          if (!result) {
            this.notify.update('There was an error retrieving the artworks', 'error');
          } else {
            return result;
          }
        }),
        catchError(this.handleHTTPError('getPendingArtworks'))
      );

  }
  getArtworks() {
    const getImagesURL = `${environment.API_BASE_URI_LOCAL}/art/admin/files`;
    return this.http.get<Files>(getImagesURL, httpOptions).pipe(
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
  setApprovalTo(approvalStatus: String, id) {
    const approveURL = `${environment.API_BASE_URI_LOCAL}/art/admin/files/${id}`;
    return this.http.put<any>(approveURL, { 'approvalStatus': approvalStatus}, httpOptions).pipe(
      map(result => {
        if (!result) {
          this.notify.update('There was an error during approval process', 'error');
        } else {
          this.notify.update(`Image is approved Successfully`, 'success');
          return result;
        }
      }),
      catchError(this.handleHTTPError('approveArtworks'))
    );
  }
}
