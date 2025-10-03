// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthGuard } from '../auth.guard';

// @Component({
//   selector: 'login',
//   standalone: false,
//   templateUrl: './login.html',
//   styleUrl: './login.css'
// })

// export class Login {
//   loginForm: FormGroup;

//   constructor(private fb: FormBuilder, private router: Router, private auth: AuthGuard) {
//     this.loginForm = this.fb.group({
//       username: ['', Validators.required],
//       password: ['', Validators.required],
//       role: ['user', Validators.required]
//     });
//   }

//   submit() {
//   const role = this.loginForm.value.role;
  
//   // Store role persistently
//   localStorage.setItem('role', role);
  
//   // Also keep it in AuthGuard memory
//   this.auth.login(role);

//   if (role === 'restaurant') this.router.navigate(['/restaurant']);
//   else this.router.navigate(['/user']);
// }


//   goRegister() {
//     this.router.navigate(['/register']);
//   }
// }


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
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    const { email, password } = this.loginForm.value;

    this.http.post<any>('https://localhost:7265/api/users/login', { email, password })
      .subscribe({
        next: (res) => {
          // res should be { id, name, role }
          this.auth.setUser(res);

          // Navigate based on role
          if (res.role === 'restaurant') {
            this.router.navigate(['/restaurant']);
          } else {
            this.router.navigate(['/user']);
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
