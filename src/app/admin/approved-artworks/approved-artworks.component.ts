import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/admin.service';
import { environment } from '../../../environments/environment';
export interface Files {
  files: Array<Object>;
  filename: string;
  contentType: string;
  metadata: Array<Object>;
}
@Component({
  selector: 'approved-artworks',
  templateUrl: './approved-artworks.component.html',
  styleUrls: ['./approved-artworks.component.scss']
})
export class ApprovedArtworksComponent implements OnInit {
  files;
  readonly base_uri = environment.API_BASE_URI_LOCAL;
  readonly url = `${this.base_uri}/art/image/`
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    return this.adminService.getPendingArtworks('approved').subscribe((images: Files) => {
      this.files = images.files
    });
  }

}
