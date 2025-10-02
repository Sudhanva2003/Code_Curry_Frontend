import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'register-restaurant',
  standalone: false,
  templateUrl: 'register-restaurant.html',
  styleUrl: './register-restaurant.css'
})
export class RegisterRestaurant {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
    // initialize the form here
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.form.valid) {
      this.auth.login(this.form.value.name, 'password', 'restaurant');
      this.router.navigate(['/restaurant']);
    }
  }
}
