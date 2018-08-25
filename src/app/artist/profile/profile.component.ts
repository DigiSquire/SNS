import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ArtworkService } from '../../core/artwork.service';
import { environment } from '../../../environments/environment';
interface Response {
  data: any,
  message,
  status: number,
  success: boolean
}
@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  // private email;
  
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
  constructor(private fb: FormBuilder, private artService: ArtworkService) {}

  // Hit the API with email id from session storage to get relevant Details according to profile
  ngOnInit() {
    const email = sessionStorage.getItem(environment.emailId);
    if (sessionStorage.getItem(environment.id) === null && email != null) {
      return this.artService.getProfile(email).subscribe((result: Response) => {
        if (result) {
          sessionStorage.setItem(environment.id, result.data._id);
          // TODO populate form with the returned details from this API call 
          // So on every subsequent visit the form comes populated
          console.log(result);
        }
      });
    }else {
      console.log('Id is already set');
    }
    
    // this.auth.loggedInUser.subscribe(message => this.email = message);
    // this.profileForm.patchValue({
    //   email : this.email
    // })
    // console.log(this.email);
  }
  // updateProfile() {
  //   this.profileForm.patchValue({
  //     firstName: 'Nancy',
  //     address: {
  //       street: '123 Drew Street'
  //     }
  //   });
  // }



  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
    return this.artService.updateProfile(this.profileForm.value).subscribe((result => {
      if (result) {
        // Preserve the form details in UI after successfull submit OR
        // The form should be populated with the values from the ngOnInit call 
        console.log(result);
      }
    }));
    
  }

}
