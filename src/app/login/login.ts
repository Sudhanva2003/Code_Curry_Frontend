import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthGuard,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
   // alert("submitted");
    if (this.loginForm.invalid) {
      alert('Please enter valid credentials');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.http.post<any>('https://localhost:7265/api/Login/login', { email, password })
      .subscribe({
        next: (res) => {
          // Expected response: { id, name, role }
          this.auth.setUser(res);
          console.log('Login Response:', res); 
          //alert("2");
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
              alert('Unknown user role');
          }
        },
        error: () => {
          alert('Invalid credentials');
        }
      });
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}
