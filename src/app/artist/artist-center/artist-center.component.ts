import { Component } from '@angular/core';
@Component({
  selector: 'artist-center',
  templateUrl: './artist-center.component.html',
  styleUrls: ['./artist-center.component.scss']
})
export class ArtistCenterComponent {
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

}
