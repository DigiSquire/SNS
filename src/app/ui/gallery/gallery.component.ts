import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';
export interface Files {
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
  private files: Array<Files>[];
  getImagesURL = `${environment.API_BASE_URI}/art/image/`
  constructor(public auth: AuthService) { }
  
  ngOnInit() {
    // return this.auth.getimages().subscribe(images => this.files = images.files);
  }
}
