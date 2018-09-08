import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../core/artwork.service'; 
import { environment } from '../../../environments/environment';
export interface Result {
  files: Array<Object>;
  message: string;
  filename: string;
  contentType: string;
  metadata: Array<Object>;
}
@Component({
  selector: 'my-artworks',
  templateUrl: './my-artworks.component.html',
  styleUrls: ['./my-artworks.component.scss']
})
export class MyArtworksComponent implements OnInit {

  files;
  isArtPresent: boolean;
  message: string;
  readonly base_uri = environment.API_BASE_URI;
  readonly url = `${this.base_uri}/gallery/image/`
  constructor(private artService: ArtworkService) { }

  ngOnInit() {
    return this.artService.getUserArtworks().subscribe((result: Result) => {
      if (result.message === undefined) {
        this.files = result.files;
        this.isArtPresent = true;
      } else {
        this.isArtPresent = false;
        this.message = result.message;
      }
    });
  }

}
