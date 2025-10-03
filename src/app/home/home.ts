import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';

@Component({
  selector: 'home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  restaurants: any[] = [];
  menu: any[] = []; // store menu for selected restaurant
  selectedRestaurant: any = null; // currently selected restaurant
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.loading = true;
    this.api.get('Restaurant/Home').subscribe({
      next: (data) => {
        this.restaurants = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch restaurants';
        this.loading = false;
      }
    });
  }

  selectRestaurant(r: any) {
    this.selectedRestaurant = r;
    this.loading = true;
    this.api.get(`Restaurant/Menu/${r.restId}`).subscribe({
      next: (data) => {
        this.menu = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch menu';
        this.loading = false;
      }
    });
  }

  backToRestaurants() {
    this.selectedRestaurant = null;
    this.menu = [];
  }
}
