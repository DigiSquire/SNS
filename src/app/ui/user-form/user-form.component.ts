import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';

type UserFields = 'email' | 'password' | 'fname' |'lname';
type FormErrors = { [u in UserFields]: string };

type ExistingUserFields = 'existingEmail' | 'existingPassword';
type ExistingFormErrors = { [u in ExistingUserFields]: string };
@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  public loading: boolean; 
  user;
  checked = true;
  role: 'public_user' | 'artist';
  setTrue: boolean;
  userForm: FormGroup;
  existingUserForm: FormGroup;
  newUser = true; // to toggle login or signup form
  passReset = false; // set to true when password reset is triggered
  emailPattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  formErrors: FormErrors = {
    'email': '',
    'password': '',
    'fname': '',
    'lname' : ''
  };
  existingFormErrors: ExistingFormErrors = {
    'existingEmail': ' ',
    'existingPassword': ''
  };
  validationMessages = {
    'fname': {
      'required': 'First Name is required.'
    },
    'lname': {
      'required': 'Last Name is required.'
    },
    'email': {
      'required': 'Email is required.',
      'pattern': 'Email must be a valid email.'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password should include at least one letter & one number, no special characters allowed.',
      'minlength': 'Password must be at least 6 characters long.',
      'maxlength': 'Password cannot be more than 25 characters long.',
    },
    'existingEmail': {
      'required': 'Email is required.',
      // 'pattern': 'Email must be a valid email.'
    },
    'existingPassword': {
      'required': 'Password is required.'
    }
    
  };

  constructor(private fb: FormBuilder, public auth: AuthService) { }

  ngOnInit() {
    this.buildSignUpForm();
    this.buildSignInForm();
  }
  // use below when we have roles defined
  // logChange = (event) => {
  //   this.role = event.checked === true ? 'artist' : 'publicUser';
  // }
  toggleForm() {
    this.newUser = !this.newUser;
  }
  signup() {
    this.auth.changeMessage(true);
    const first_name: string = this.userForm.value['fname'];
    const last_name: string = this.userForm.value['lname'];
    // console.log(this.userForm.value['email'], this.userForm.value['password'], this.userForm.value['fname'], this.userForm.value['lname']);
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'], first_name, last_name);
  }
  login() {
    this.auth.changeMessage(true);
    this.auth.emailLogin(this.existingUserForm.value['existingEmail'], this.existingUserForm.value['existingPassword']);
  }
  logout() {
    this.auth.changeMessage(true);
    return this.auth.signOut;
  }
  resetPassword() {
    window.scroll(0, 0);
    this.auth.changeMessage(true);
    this.auth.resetPassword(this.existingUserForm.value['existingEmail'])
      .then(() => {
        this.passReset = false;
        this.existingUserForm.reset();
        this.auth.changeMessage(false);
      });
  }

  buildSignUpForm() {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.pattern(this.emailPattern)
      ]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
      // 'role': [''],
      'fname': ['', [
        Validators.required
      ]],
      'lname': ['', [
        Validators.required
      ]]
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }
  buildSignInForm() {
    this.existingUserForm = this.fb.group({
      'existingEmail': ['', [
        Validators.required
        // ,
        // Validators.pattern(this.emailPattern)
      ]],
      'existingPassword': ['',
      [
        Validators.required,
        // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        // Validators.minLength(6),
        // Validators.maxLength(25),
      ]
    ]
    });

    this.existingUserForm.valueChanges.subscribe((data) => this.onExistingValueChanged(data));
    this.onExistingValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'fname' || field === 'lname' || field === 'email' || field === 'password' )) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.formErrors[field] += `${(messages as { [key: string]: string })[key]} `;
              }
            }
          }
        }
      }
    }
  }
  onExistingValueChanged(data?: any) {
    if (!this.existingUserForm) { return; }
    const form = this.existingUserForm;
    for (const field in this.existingFormErrors) {
      if (Object.prototype.hasOwnProperty.call(this.existingFormErrors, field) && (field === 'existingEmail' || field === 'existingPassword')) {
        // clear previous error message (if any)
        this.existingFormErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.existingFormErrors[field] += `${(messages as { [key: string]: string })[key]} `;
              }
            }
          }
        }
      }
    }
  }
}
