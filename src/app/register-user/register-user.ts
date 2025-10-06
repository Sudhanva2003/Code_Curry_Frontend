import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'register-user',
  standalone: false,
  templateUrl: 'register-user.html',
  styleUrls: ['./register-user.css']
})
export class RegisterUser {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthGuard,
    private http: HttpClient
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (!this.form.valid) {
      alert('Please fill all fields correctly.');
      return;
    }

    const userData = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      address: this.form.value.address,
      password: this.form.value.password,
      role: 'user' // backend defaults to user, kept for clarity
    };

    // Step 1: Register the user
    this.http.post('https://localhost:7265/api/Users/register', userData).subscribe({
      next: () => {
        // Step 2: Auto-login using the same flow as login.ts
        this.http.post<any>('https://localhost:7265/api/users/login', {
          email: userData.email,
          password: userData.password
        }).subscribe({
          next: (res) => {
            // Save user details via AuthGuard
            this.auth.setUser(res);

            // Redirect based on role
            if (res.role === 'user') {
              this.router.navigate(['/user']);
            } else {
              this.router.navigate(['/restaurant']);
            }
          },
          error: () => {
            alert('Login failed after registration.');
          }
        });
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Email already exists.');
        } else {
          alert('Registration failed.');
        }
      }
    });
  }
}
