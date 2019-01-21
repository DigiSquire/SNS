import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ArtworkService } from '../../core/artwork.service';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/result.interface';
import { AuthService } from '../../core/auth.service';
import { country, countryCodes } from '../../core/countries.model';
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  email: string;
  finished = false;
  noData = true;
  countries = country.sort();;

  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: sessionStorage.getItem(environment.emailId),
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
  constructor(private fb: FormBuilder, private artService: ArtworkService, private auth: AuthService) {
    this.auth.getEmail.subscribe((message) => this.email = message);
  }

  // Hit the API with email id from session storage to get relevant Details according to profile
  ngOnInit() {
    const email = this.email;
    console.log(`Signed in user's email is: ${this.email}`);
    if (email != null) {
      return this.artService.getProfile(email).subscribe((result: Result) => {
        if (result) {
          sessionStorage.setItem(environment.id, result.data._id);
          sessionStorage.setItem('fname', result.data.firstname);
          sessionStorage.setItem('lname', result.data.lastname);
          // Set values for country explicitly, case should be same
          if (result.data.address) {
            this.profileForm.get('address.country').setValue(result.data.address.country);
            // Patch other values as there values will not throw error when not found
            this.profileForm.patchValue({
              firstName: result.data.firstname,
              lastName: result.data.lastname,
              contactNumber: result.data.contactNumber,
              countryCode: result.data.countryCode,
              email: this.email,
              address: {
                street: result.data.address.street,
                city: result.data.address.city,
                state: result.data.address.state,
                zip: result.data.address.zip
              }
            });
          }else {
            this.profileForm.patchValue({
              firstName: result.data.firstname,
              lastName: result.data.lastname,
              email: this.email
            });
          }
          
          // TODO populate form with the returned details from this API call 
          // So on every subsequent visit the form comes populated
          console.log(result);
          this.finished = true;
          this.noData = false;
        }else {
          this.finished = true;
          this.noData = true;
        }
      });
    }
    // else {
    //   console.log('Id is already set');
    // }
    
    // this.auth.loggedInUser.subscribe(message => this.email = message);
    // this.profileForm.patchValue({
    //   email : this.email
    // })
    // console.log(this.email);
  }


  setCountryCode($event) {
    this.profileForm.get('countryCode').patchValue(countryCodes[$event]);
  }
  onSubmit() {
    window.scroll(0, 0);
    console.log(this.profileForm.value);
    return this.artService.updateProfile(this.profileForm.value).subscribe((result => {
      if (result) {
        // Preserve the form details in UI after successful submit OR
        // The form should be populated with the values from the ngOnInit call 
        console.log(result);
      }
    }));
    
  }

}
