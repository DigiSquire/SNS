import { Component, OnInit, Input } from '@angular/core';
import { ArtworkService } from '../../core/artwork.service';
import { AdminService } from '../../core/admin.service';
import { AuthService } from '../../core/auth.service';
import { BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { Result } from '../../core/result.interface';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'artwork-card',
  templateUrl: './artwork-card.component.html',
  styleUrls: ['./artwork-card.component.scss']
})
export class ArtworkCardComponent implements OnInit {
  @Input () consumer: string;
  @Input() action: string;
  email: string;
  files = new BehaviorSubject([]);
  lastKey = '';
  finished = false;
  isArtPresent: boolean;
  message: string;

  constructor(private artService: ArtworkService,
    private auth: AuthService,
    private adminService: AdminService,
    private dialog: MatDialog) { 
    this.auth.getEmail.subscribe((message) => this.email = message);
  }

  ngOnInit() {
    this.getFiles();
  }
  onScroll() {
    if (this.lastKey) {
      console.log(`Last ID to query by: ${this.lastKey}`);
      this.getFiles(this.lastKey);
    }
  }
  private getFiles(key?) {
    if (this.finished) { return }
    if (this.consumer === 'gallery') {
      return this.artService.getArtworks(key).pipe(
        tap((images: Result) => {
          if (images !== null && images.message === undefined) {
            /// set the lastKey in preparation for next query
            console.log(`Initial this.lastKey on client is :${this.lastKey}`);
            this.lastKey = images.last_id;
            console.log(`updated this.lastKey on client is :${this.lastKey}`);
            const newFiles = images.files;
            /// Get current movies in BehaviorSubject
            const currentFiles = this.files.getValue();
            /// Concatenate new movies to current movies
            this.files.next(currentFiles.concat(newFiles));
          } else {
            this.finished = true;
          }
        }),
        take(1)
      ).subscribe();
    } else if (this.consumer === 'artist-center') {
      return this.artService.getUserArtworks(this.email, key).pipe(
        tap((images: Result) => {
          if (images.status === 504) {
            this.isArtPresent = true;
            this.finished = true;
            return;
          }
          if (images.message !== undefined) {
            this.isArtPresent = false;
            this.message = images.message;
            this.finished = true;
            return;
          }
          if (images !== null && images.message === undefined) {
            /// set the lastKey in preparation for next query
            console.log(`Initial Key on client is :${this.lastKey}`);
            this.lastKey = images.last_id;
            console.log(`Received and updated Key on client to :${this.lastKey}`);
            const newFiles = images.files;
            /// Get current movies in BehaviorSubject
            const currentFiles = this.files.getValue();
            /// Concatenate new movies to current movies
            this.files.next(currentFiles.concat(newFiles));
            this.isArtPresent = true;
          } else {
            this.finished = true;
          }
        }),
        take(1)
      ).subscribe();
    }else if (this.consumer === 'admin-center') {
      return this.adminService.getPendingArtworks(this.action, key).pipe(
        tap((images: Result) => {
        if (images.status === 504) {
          this.isArtPresent = true;
          this.finished = true;
          return;
        }
        if (images.message !== undefined) {
          this.isArtPresent = false;
          this.message = images.message;
          this.finished = true;
          return;
        }
        if (images !== null && images.message === undefined) {
          /// set the lastKey in preparation for next query
          console.log(`Initial this.lastKey on client is :${this.lastKey}`);
          this.lastKey = images.last_id;
          console.log(`updated this.lastKey on client is :${this.lastKey}`);
          const newFiles = images.files;
          /// Get current movies in BehaviorSubject
          const currentFiles = this.files.getValue();
          /// Concatenate new movies to current movies
          this.files.next(currentFiles.concat(newFiles));
          this.isArtPresent = true;
        } else {
          this.finished = true;
        }
      }),
        take(1)
      ).subscribe();
    }
  }
  openDialog(action: string, id): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        approvalStatus: action,
        objectId: id
      }
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        this.updatePending(data);
      }
    );
  }
  updatePending(data) {
    const currentFiles = this.files.getValue();
    currentFiles.forEach((item, index) => {
      if (item._id === data) { currentFiles.splice(index, 1); }
    });
    this.files.next(currentFiles);
  }
}
