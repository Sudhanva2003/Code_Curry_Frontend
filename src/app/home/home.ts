import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';

@Component({
  selector: 'home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})

export class Home implements OnInit {
  restaurants: any[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    // call /api/restaurant/home
    this.api.get('Restaurant/Home').subscribe({
      next: (data) => {
        this.restaurants = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch data';
        this.loading = false;
      }
    });
  }
}
