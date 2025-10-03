import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-restaurant-settings',
  standalone: false,
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class Settings implements OnInit {
  restaurant: any;
  role: string | null = null;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.role = this.authService.getRole();
      this.apiService.get('Restaurant/ViewRestaurant/2').subscribe({
        next: (data) => {
          this.restaurant = data;
        },
        error: (err) => {
          console.error('Error fetching restaurant profile:', err);
        }
      });
    } else {
      console.warn('User not logged in');
    }
  }
}
