import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'register-user',
  standalone: false,
  templateUrl: 'register-user.html',
  styleUrl: './register-user.css'
})
export class RegisterUser {
  form: FormGroup;   // declare property

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    // initialize form inside constructor
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.auth.login(this.form.value.name, 'password', 'user');
      this.router.navigate(['/user']);
    }
  }
}
