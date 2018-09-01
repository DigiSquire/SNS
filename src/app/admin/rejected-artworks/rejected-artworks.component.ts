import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/admin.service';
import { environment } from '../../../environments/environment';
export interface Result {
  files: Array<Object>;
  message: string;
  filename: string;
  contentType: string;
  metadata: Array<Object>;
}
@Component({
  selector: 'rejected-artworks',
  templateUrl: './rejected-artworks.component.html',
  styleUrls: ['./rejected-artworks.component.scss']
})
export class RejectedArtworksComponent implements OnInit {
  files;
  isArtPresent: boolean;
  message: string;
  readonly base_uri = environment.API_BASE_URI_LOCAL;
  readonly url = `${this.base_uri}/art/image/`
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    return this.adminService.getPendingArtworks('rejected').subscribe((result: Result) => {
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
