import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {
  user: any = null;
  role: 'user' | 'restaurant' | null = null;
  showProfileBox = false;

  constructor(private auth: AuthGuard,private router: Router) {}

  ngOnInit() {
    const user = this.auth.getUser();
    this.user=user;
    this.role = user ? user.role : null;
  }

  toggleProfileBox() {
    this.showProfileBox = !this.showProfileBox;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}


