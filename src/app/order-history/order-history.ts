import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistory implements OnInit {
  pastOrders: any[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    const restId = this.auth.getId(); // restaurant ID
    if (restId) {
      this.api.get(`Restaurant/ViewRestaurantPastOrders/${restId}`).subscribe({
        next: (res: any) => {
          console.log("API Response:", res);
          this.pastOrders = res || [];
          this.loading = false;
        },
        error: (err) => {
          console.error("API Error:", err);
          this.error = 'Failed to load past orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "Restaurant not logged in";
      this.loading = false;
    }
  }
}
