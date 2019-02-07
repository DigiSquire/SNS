import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ArtworkService } from '../../core/artwork.service';
import { UserProfile } from '../../core/result.interface';
import { AuthService } from '../../core/auth.service';
import { country, countryCodes } from '../../core/countries.model';
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile;
  finished = false;
  noData = true;
  countries = country.sort();

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: '',
    countryCode: ['', Validators.required],
    contactNumber: ['', Validators.required],
    address: this.fb.group({
      street: ['', [Validators.required]],
      country: ['',
                [Validators.required,
                Validators.maxLength(74)]
              ],
      city: ['',
                [Validators.required,
                Validators.maxLength(85)]
              ],
      state: ['', 
                [Validators.required,
                Validators.maxLength(50)]
              ],
      zip: ['', Validators.required]
    }),
  });
  constructor(private fb: FormBuilder, private artService: ArtworkService, private auth: AuthService) {}

  ngOnInit() {
    this.auth.getUserProfile.subscribe((userProfileReceived: UserProfile) => {
      this.userProfile = userProfileReceived;
      console.log('User profile received on PROFILE On-INIT******', this.userProfile)
      this.mapDataToProfileForm(this.auth.getUserProfileData());
    });
    
  }

  mapDataToProfileForm(userProfile: UserProfile) {
    
    if (userProfile) {
      console.log('mapping runs...............')
      // Set values for country explicitly, case should be same
      if (userProfile.address !== undefined) {
        this.profileForm.get('address.country').setValue(userProfile.address.country);
        // Patch other values as there values will not throw error when not found
        this.profileForm.patchValue(
          // firstName: userProfile.firstName,
          // lastName: userProfile.lastName,
          // contactNumber: userProfile.contactNumber,
          // countryCode: userProfile.countryCode,
          // email: userProfile.email,
          // address: {
          //   street: userProfile.address.street,
          //   city: userProfile.address.city,
          //   state: userProfile.address.state,
          //   zip: userProfile.address.zip
          // }
          userProfile
        );
      } else {
        this.profileForm.patchValue(
          // firstName: userProfile.firstName,
          // lastName: userProfile.lastName,
          // email: userProfile.email
          userProfile
        );
      }

      // TODO populate form with the returned details from this API call 
      // So on every subsequent visit the form comes populated
      this.finished = true;
      this.noData = false;
    } else {
      console.log('mapping DOES NOT run')
      this.finished = true;
      this.noData = true;
    }

  }
  setCountryCode($event) {
    this.profileForm.get('countryCode').patchValue(countryCodes[$event]);
  }
  onSubmit() {
    window.scroll(0, 0);
    return this.artService.updateProfile(this.profileForm.value).subscribe((result => {
      if (result) {
        this.auth.setUserProfile(this.profileForm.value);
      }
    }));
    
  }

}
