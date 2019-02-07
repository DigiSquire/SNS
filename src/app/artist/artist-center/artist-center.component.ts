import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../../core/notify.service';
import { AuthService } from '../../core/auth.service';
import { Result, UserProfile } from '../../core/result.interface';
import { ArtworkService } from '../../core/artwork.service';
@Component({
  selector: 'artist-center',
  templateUrl: './artist-center.component.html',
  styleUrls: ['./artist-center.component.scss']
})
export class ArtistCenterComponent implements OnInit  { 
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
  userProfile: UserProfile;
  constructor(private notify: NotifyService, private auth: AuthService, private artService: ArtworkService) {}
  ngOnInit() {
    this.getProfileData();
  }
  getProfileData() {
    
    const email = this.auth.getUserProfileData().email;
    if (email != null) {
      return this.artService.getProfile(email).subscribe((result: Result) => {
        if (result) {
          let userProfile: UserProfile;
          userProfile = {
            email: email,
            artBy: `${result.data.firstname} ${result.data.lastname}`,
            firstName: result.data.firstname,
            lastName: result.data.lastname,
            _id: result.data._id
          }
          if (result.data.address) {
            const userContactInfo = {
              contactNumber: result.data.contactNumber,
              countryCode: result.data.countryCode,
              address: {
                street: result.data.address.street,
                city: result.data.address.city,
                state: result.data.address.state,
                zip: result.data.address.zip,
                country: result.data.address.country
            }
          }
            Object.assign(userProfile, userContactInfo);
        }
          this.auth.setUserProfile(userProfile);
          console.log('UPDATING user profile from ARTIST CENTER On-INIT*****', userProfile);
      }
    });
    }
  }
  clearMsg = () => {
    this.notify.clear();
  }
}
