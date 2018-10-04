import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ArtworkService } from '../../core/artwork.service';
import { environment } from '../../../environments/environment';
import { Result } from '../../core/result.interface';
import { AuthService } from '../../core/auth.service';
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  email: string;
  finished = false;
  profileForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: sessionStorage.getItem(environment.emailId),
    contactNumber: '',
    address: ''
    // address: this.fb.group({
    //   street: [''],
    //   city: [''],
    //   state: [''],
    //   zip: ['']
    // })
  });
  constructor(private fb: FormBuilder, private artService: ArtworkService, private auth: AuthService) {
    this.auth.getEmail.subscribe((message) => this.email = message);
  }

  // Hit the API with email id from session storage to get relevant Details according to profile
  ngOnInit() {
    const email = this.email;
    console.log(`Signed in user's email is: ${this.email}`)
    if (email != null) {
      return this.artService.getProfile(email).subscribe((result: Result) => {
        if (result) {
          sessionStorage.setItem(environment.id, result.data._id);
          sessionStorage.setItem('fname', result.data.firstname);
          sessionStorage.setItem('lname', result.data.lastname);
          this.profileForm.patchValue({
            firstName: result.data.firstname,
            lastName: result.data.lastname,
            contactNumber: result.data.contact,
            address: result.data.deliveryAddress,
            email: this.email

          });
          // TODO populate form with the returned details from this API call 
          // So on every subsequent visit the form comes populated
          console.log(result);
          this.finished = true;
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



  onSubmit() {
    window.scroll(0, 0);
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
    return this.artService.updateProfile(this.profileForm.value).subscribe((result => {
      if (result) {
        // Preserve the form details in UI after successful submit OR
        // The form should be populated with the values from the ngOnInit call 
        console.log(result);
      }
    }));
    
  }

}
