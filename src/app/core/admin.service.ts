import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';

import { NotifyService } from './notify.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  private handleHTTPError: HandleError;
  constructor(private http: HttpClient, private notify: NotifyService, httpErrorHandler: HttpErrorHandler) {
    this.handleHTTPError = httpErrorHandler.createHandleError('AdminService');
  }
  getPendingArtworks = (approvalStatus, lastKey?) => {
    const getImagesURL = `${environment.API_BASE_URI}/admin/${approvalStatus}`;
    let params;
    if (lastKey != null || lastKey !== '' && lastKey !== undefined) {
      params = new HttpParams()
        .set('last_id', lastKey);
    } 
    return this.http.get<Files>(getImagesURL, { params }).pipe(
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
  setApprovalTo(approvalStatus: String, id) {
    const approveURL = `${environment.API_BASE_URI}/admin/files/${id}`;
    return this.http.put<any>(approveURL, { 'approvalStatus': approvalStatus}, httpOptions).pipe(
      map(result => {
        if (!result) {
          this.notify.update('There was an error during approval process', 'error');
        } else {
          this.notify.update(`${result.message}`, 'success');
          return result;
        }
      }),
      catchError(this.handleHTTPError('approveArtworks'))
    );
  }
}
