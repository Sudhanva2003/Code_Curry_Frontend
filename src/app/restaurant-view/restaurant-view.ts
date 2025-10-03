import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'restaurant-view',
  standalone: false,
  templateUrl: './restaurant-view.html',
  styleUrl: './restaurant-view.css'
})
export class RestaurantView implements OnInit {
  restaurantName: string = '';

  constructor(private auth: AuthGuard) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user && user.role === 'restaurant') {
      this.restaurantName = user.name;  // get restaurant name
    }
  }
}
