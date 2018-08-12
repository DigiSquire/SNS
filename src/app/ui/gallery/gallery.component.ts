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
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})

export class GalleryComponent implements OnInit {
  private files;
  readonly base_uri= environment.API_BASE_URI;
  readonly url = `${this.base_uri}/art/image/`
  constructor(private artService: ArtworkService) { }
  
  ngOnInit() {
    return this.artService.getArtworks().subscribe((images: Files) => {
      this.files = images.files
    });
  }
}
