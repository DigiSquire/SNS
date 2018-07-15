import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };
@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  // signupForm: FormGroup;
  // detailForm: FormGroup;
  userForm: FormGroup;
  emailPattern: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  newUser = true; // to toggle login or signup form
  passReset = false; // set to true when password reset is triggered
  formErrors: FormErrors = {
    'email': '',
    'password': '',
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email',
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    },
  };
  constructor(public fb: FormBuilder, public auth: AuthService) { }

  ngOnInit() {

    // First Step
    // this.signupForm = this.fb.group({
    //   'email': ['', [
    //     Validators.required,
    //     Validators.email
    //   ]
    //   ],
    //   'password': ['', [
    //     Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
    //     Validators.minLength(6),
    //     Validators.maxLength(25),
    //     Validators.required
    //   ]
    //   ],
    //   'region': ['', [
    //   ]
    //   ],
    // });

    // Second Step
    // this.detailForm = this.fb.group({
    //   'catchPhrase': ['', [Validators.required]]
    // });
    this.buildForm();
  }

  // Using getters will make your code look pretty
  // get email() { return this.signupForm.get('email') }
  // get password() { return this.signupForm.get('password') }

  // get catchPhrase() { return this.detailForm.get('catchPhrase') }


  // Step 1
  // signup() {
  //   return this.auth.emailSignUp(this.email.value, this.password.value)
  // }

  // Step 2
  // setCatchPhrase(user) {
  //   return this.auth.updateUser(user, { catchPhrase: this.catchPhrase.value })
  // }
  
  toggleForm() {
    this.newUser = !this.newUser;
  }

  signup() {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password']);
  }

  login() {
    this.auth.emailLogin(this.userForm.value['email'], this.userForm.value['password']);
  }

  resetPassword() {
    this.auth.resetPassword(this.userForm.value['email'])
      .then(() => this.passReset = true);
  }
  buildForm() {
    this.userForm = this.fb.group({
      'email': [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]],
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }
  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password')) {
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
}
