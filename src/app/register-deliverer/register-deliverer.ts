import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthGuard } from '../auth.guard';
import { NotificationService } from '../notification.service';  // <-- Import NotificationService

@Component({
  selector: 'app-register-deliverer',
  standalone: false,
  templateUrl: './register-deliverer.html',
  styleUrls: ['./register-deliverer.css']
})
export class RegisterDeliverer {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: AuthGuard,
    private notificationService: NotificationService  // <-- Inject NotificationService
  ) {
    this.form = fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      licenseNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,15}$/)]],
      vehicleNumber: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{6,12}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['deliverer', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.notificationService.show('Please fill all fields correctly.', 3000);  // <-- Error Notification
      return;
    }

    const delivererData = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      address: this.form.value.address,
      licenseNumber: this.form.value.licenseNumber,
      vehicleNumber: this.form.value.vehicleNumber,
      password: this.form.value.password,
      role: this.form.value.role
    };

    this.http.post('https://localhost:7265/api/Deliverer/DelivererRegister', delivererData).subscribe({
      next: () => {
        this.http.post<any>('https://localhost:7265/api/Login/login', {
          email: delivererData.email,
          password: delivererData.password
        }).subscribe({
          next: (res) => {
            this.auth.setUser(res);
            this.router.navigate(['/deliverer']);
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
          this.notificationService.show('Deliverer registration failed.', 3000);  // <-- Error Notification
        }
      }
    });
  }
}
