import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/admin.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { Result } from '../../core/result.interface';
@Component({
  selector: 'rejected-artworks',
  templateUrl: './rejected-artworks.component.html',
  styleUrls: ['./rejected-artworks.component.scss']
})
export class RejectedArtworksComponent implements OnInit {
  files = new BehaviorSubject([]);
  lastKey = '';
  finished = false;
  isArtPresent: boolean;
  message: string;
  readonly base_uri = environment.API_BASE_URI;
  readonly url = `${this.base_uri}/gallery/image/`
  constructor(private adminService: AdminService) { }
  
  ngOnInit() {
    this.getFiles();
  }
  onScroll() {
    console.log(`this.lastKey on scroll is :${this.lastKey}`);
    this.getFiles(this.lastKey);
  }
  private getFiles(key?) {
    if (this.finished) { return }
    return this.adminService.getPendingArtworks('rejected', key).pipe(
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
