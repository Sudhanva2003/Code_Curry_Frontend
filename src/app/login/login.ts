import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthGuard) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['user', Validators.required]
    });
  }

  submit() {
  const role = this.loginForm.value.role;
  
  // Store role persistently
  localStorage.setItem('role', role);
  
  // Also keep it in AuthGuard memory
  this.auth.login(role);

  if (role === 'restaurant') this.router.navigate(['/restaurant']);
  else this.router.navigate(['/user']);
}


  goRegister() {
    this.router.navigate(['/register']);
  }
}
