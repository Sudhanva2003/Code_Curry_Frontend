import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';  // <-- Import NotificationService

@Component({
  selector: 'register-customer',
  standalone: false,
  templateUrl: 'register-customer.html',
  styleUrls: ['./register-customer.css']
})
export class RegisterCustomer {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthGuard,
    private http: HttpClient,
    private notificationService: NotificationService  // <-- Inject NotificationService
  ) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'), // only digits
          Validators.minLength(10),
          Validators.maxLength(15)
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['customer', Validators.required] // default role
    });
  }

  submit() {
    if (!this.form.valid) {
      this.notificationService.show('Please fill all fields correctly.', 3000);  // <-- Error Notification
      return;
    }

    const userData = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      address: this.form.value.address,
      password: this.form.value.password,
      role: this.form.value.role
    };

    this.http.post('https://localhost:7265/api/Customer/register', userData).subscribe({
      next: () => {
        this.http.post<any>('https://localhost:7265/api/Login/login', {
          email: userData.email,
          password: userData.password
        }).subscribe({
          next: (res) => {
            this.auth.setUser(res);

            if (res.role === 'customer') {
              this.router.navigate(['/customer']);
            } else if (res.role === 'restaurant') {
              this.router.navigate(['/restaurant']);
            } else if (res.role === 'deliverer') {
              this.router.navigate(['/deliverer']);
            } else if (res.role === 'admin') {
              this.router.navigate(['/admin']);
            }
            this.notificationService.show('Login successful, welcome!', 3000);  // <-- Success Notification
          },
          error: () => {
            this.notificationService.show('Login failed after registration.', 3000);  // <-- Error Notification
          }
        });
      },
      error: (err) => {
        if (err.status === 409) {
          this.notificationService.show('Email already exists.', 3000);  // <-- Error Notification
        } else {
          this.notificationService.show('Registration failed.', 3000);  // <-- Error Notification
        }
      }
    });
  }
}
