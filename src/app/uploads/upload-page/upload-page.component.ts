import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap, finalize } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpErrorHandler, HandleError } from '../../core/http-error-handler.service';
const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'my-auth-token',
    'Access-Control-Allow-Origin': '*',
  })
};

@Component({
  selector: 'upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.scss']
})
export class UploadPageComponent {
  // Main task
  // task: AngularFireUploadTask;
  uploadUrl = 'http://localhost:5000/upload';
  private handleHTTPError: HandleError;
  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;
file;
  // Download URL
  downloadURL: Observable<string>;

  // State for dropzone CSS toggling
  isHovering: boolean;
  @Output() messageFile = new EventEmitter<string>();
  constructor(
    // private storage: AngularFireStorage,
    // private db: AngularFirestore
    private http: HttpClient, httpErrorHandler: HttpErrorHandler
  ) {
    this.handleHTTPError = httpErrorHandler.createHandleError('uploadComp');
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    this.file = event.item(0);

    // Client-side validation example
    if (this.file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    // Totally optional metadata
    const customMetadata = { app: 'My AngularFire-powered PWA!' };
    console.log(this.file);
    console.log('emited');
    this.messageFile.emit(this.file);
    // return this.updateUserData(file).subscribe((result => {
    //   console.log(result);
    // }));
    // Progress monitoring
    // this.percentage = this.task.percentageChanges();
    // this.snapshot = this.task.snapshotChanges().pipe(
    //   tap(snap => {
    //     if (snap.bytesTransferred === snap.totalBytes) {
    //       // Update firestore on completion
    //       this.db.collection('photos').add({ path, size: snap.totalBytes });
    //     }
    //   }),
    //   finalize(() => this.downloadURL = this.storage.ref(path).getDownloadURL() )
    // );


    // The file's download URL
  }
  private updateUserData(file) {

    // const data: User = {
    //   uid: user.uid,
    //   email: user.email,
    //   displayName: user.displayName || 'nameless user',
    //   photoURL: user.photoURL || 'https://goo.gl/Fz9nrQ'
    // }
    const formData: FormData = new FormData();
    formData.append('file', file);
    console.log(file);
    return this.http.post(this.uploadUrl, formData, httpOptions).pipe(
      catchError(this.handleHTTPError('updateUserData'))
    );
  }
  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
