import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/admin.service';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
export interface Result {
  files: Array<Object>;
  filename: string;
  message: string;
  contentType: string;
  metadata: Array<Object>;
}
@Component({
  selector: 'pending-artworks',
  templateUrl: './pending-artworks.component.html',
  styleUrls: ['./pending-artworks.component.scss']
})
export class PendingArtworksComponent implements OnInit {
  files;
  isArtPresent: boolean;
  message: string;
  readonly base_uri = environment.API_BASE_URI;
  readonly url = `${this.base_uri}/gallery/image/`
  constructor(private adminService: AdminService, private dialog: MatDialog) { }

  ngOnInit() {
    return this.adminService.getPendingArtworks('pending').subscribe((result: Result) => {
      if (result.message === undefined) {
        this.files = result.files;
        this.isArtPresent = true;
      }else {
        this.isArtPresent = false;
        this.message = result.message;
      }
      
    });
  }
  openDialog(action: string, id): void {
    this.dialog.open(DialogComponent, {
      data: { approvalStatus: action,
              objectId: id }
    });
  }
}
