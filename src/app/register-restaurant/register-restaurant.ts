import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'register-restaurant',
  standalone: false,
  templateUrl: 'register-restaurant.html',
  styleUrls: ['./register-restaurant.css']
})
export class RegisterRestaurant {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthGuard,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fssaiNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{14}$/)]],
      gstNumber: ['', [Validators.required, Validators.pattern(/^[0-9A-Z]{15}$/)]],
      cuisine: [''] // optional
    });
  }

  submit() {
    if (!this.form.valid) {
      alert('Please fill all fields correctly.');
      return;
    }

    const restaurantData = {
      name: this.form.value.name,
      email: this.form.value.email,
      phone: this.form.value.phone,
      address: this.form.value.address,
      password: this.form.value.password,
      FssaiNo: this.form.value.fssaiNumber,
      GstNo: this.form.value.gstNumber,
      cuisine: this.form.value.cuisine,
    };

    this.http.post('https://localhost:7265/api/Restaurant/RegisterRestaurant', restaurantData)
      .subscribe({
        next: () => {
          this.http.post<any>('https://localhost:7265/api/Login/login', {
            email: restaurantData.email,
            password: restaurantData.password
          }).subscribe({
            next: (res) => {
              this.auth.setUser(res);
              if (res.role === 'restaurant') {
                this.router.navigate(['/restaurant']);
              } else {
                this.router.navigate(['/customer']);
              }
            },
            error: () => alert('Login failed after registration.')
          });
        },
        error: (err: any) => {
          if (err.status === 409) {
            alert('Email already exists.');
          } else if (err.status === 400 && err.error?.errors) {
            const messages = Object.values(err.error.errors).flat().join('\n');
            alert('Validation errors:\n' + messages);
          } else {
            alert('Restaurant registration failed.');
          }
        }
      });
  }
}
