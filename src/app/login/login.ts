import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../notification.service';  // <-- Import NotificationService

@Component({
  selector: 'login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthGuard,
    private http: HttpClient,
    private notificationService: NotificationService  // <-- Inject NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    // Show notification instead of alert for invalid form
    if (this.loginForm.invalid) {
      this.notificationService.show('Please enter valid credentials', 3000);
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post<any>('https://localhost:7265/api/Login/login', { email, password })
      .subscribe({
        next: (res) => {
          // Expected response: { id, name, role }
          this.auth.setUser(res);
          console.log('Login Response:', res);
          
          switch (res.role?.toLowerCase()) {
            case 'restaurant':
              this.router.navigate(['/restaurant']);
              break;

            case 'customer':
              this.router.navigate(['/customer']);
              break;

            case 'deliverer':
              this.router.navigate(['/deliverer']);
              break;

            case 'admin':
              this.router.navigate(['/admin']);
              break;

            default:
              this.notificationService.show('Unknown user role', 3000);
          }
        },
        error: () => {
          this.notificationService.show('Invalid credentials', 3000);  // <-- Show notification for error
        }
      });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}
