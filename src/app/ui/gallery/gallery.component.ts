import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../core/artwork.service';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';

export interface Result {
  files: Array<Object>;
  message: string;
  last_id: string;
}
@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html', 
  styleUrls: ['./gallery.component.scss']
})

export class GalleryComponent implements OnInit {
  files = new BehaviorSubject([]);
  readonly base_uri= environment.API_BASE_URI;
  readonly url = `${this.base_uri}/gallery/image/`;
  lastKey = '' ;     // key to offset next query from
  finished = false;  // boolean when end of database is reached
  constructor(private artService: ArtworkService) { }
  
  ngOnInit() {
    this.getFiles();
  }
  onScroll() {
    console.log(`this.lastKey on scroll is :${this.lastKey}`);
    this.getFiles(this.lastKey);
  }
  private getFiles(key?) {
    if (this.finished) { return }
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
  }





}

