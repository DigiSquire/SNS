import { Component, OnInit } from '@angular/core';
import { ArtworkService } from '../../core/artwork.service';
import { environment } from '../../../environments/environment';
export interface Files {
  files: Array<Object>;
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

  private files;
  readonly base_uri = environment.API_BASE_URI;
  readonly url = `${this.base_uri}/art/image/`
  constructor(private artService: ArtworkService) { }

  ngOnInit() {
    return this.artService.getUserArtworks().subscribe((images: Files) => {
      this.files = images.files
    });
  }

}
