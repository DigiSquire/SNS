import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../core/notify.service';
@Component({
  selector: 'artist-center',
  templateUrl: './artist-center.component.html',
  styleUrls: ['./artist-center.component.scss']
})
export class ArtistCenterComponent implements OnInit { 
  navLinks = [{
    'path': './profile',
    'label': 'Profile'
  }, {
      'path': './upload',
      'label': 'Upload'
    }, {
      'path': './my-artworks',
      'label': 'My Artworks'
    }];
  activeLink = this.navLinks[0];
  constructor(private notify: NotifyService) {}
  ngOnInit() {
    this.notify.update('Welcome To Spaces & Stories Artist Center', 'success');
  }
}
