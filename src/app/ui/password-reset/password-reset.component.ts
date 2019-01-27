import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';

type UserFields = 'password';
type FormErrors = { [u in UserFields]: string };
@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  public loading: boolean;
  activatedRouteParams;
  user;
  userForm: FormGroup;
  formErrors: FormErrors = {
    'password': ''
  };
  validationMessages = {
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password should include at least one letter & one number, no special characters allowed.',
      'minlength': 'Password must be at least 6 characters long.',
      'maxlength': 'Password cannot be more than 25 characters long.',
    }

  };
  constructor(private fb: FormBuilder, public auth: AuthService, private activatedRoute: ActivatedRoute) { 
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.activatedRouteParams = { ...params };
    });
  }

  ngOnInit() {
    this.buildPasswordResetForm();
  }
  resetPassword() {
    this.auth.changeMessage(true);
    this.auth.confirmPasswordReset(this.activatedRouteParams.params.oobCode, this.userForm.value['password']);
  }
  buildPasswordResetForm() {
    this.userForm = this.fb.group({
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
      ]]
    });

    this.userForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'password')) {
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
