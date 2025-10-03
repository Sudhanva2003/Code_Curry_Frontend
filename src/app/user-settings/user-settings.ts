import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-settings',
  standalone: false,
  templateUrl: './user-settings.html',
  styleUrls: ['./user-settings.css']
})
export class UserSettings implements OnInit {
  user: any;
  role: string | null = null;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.role = this.authService.getRole();
      this.apiService.get('Users/ViewUser/1').subscribe({
        next: (data) => {
          this.user = data;
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
        }
      });
    } else {
      console.warn('User not logged in');
    }
  }
}
