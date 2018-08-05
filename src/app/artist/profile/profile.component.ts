import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
// import { AuthService } from '../../core/auth.service';

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
    email: sessionStorage.getItem('emailId'),
    contactNumber: '',
    address: ''
    // address: this.fb.group({
    //   street: [''],
    //   city: [''],
    //   state: [''],
    //   zip: ['']
    // })
  });
  constructor(private fb: FormBuilder
  // private auth: AuthService
  ) { }

  ngOnInit() {
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
  }

}
