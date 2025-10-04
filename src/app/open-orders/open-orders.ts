import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'open-orders',
  standalone: false,
  templateUrl: './open-orders.html',
  styleUrls: ['./open-orders.css']
})
export class OpenOrders implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    const restId = this.auth.getId(); // restaurant ID
    if (restId) {
      this.api.get(`Restaurant/ViewRestaurantOpenOrders/${restId}`).subscribe({
        next: (res: any) => {
          console.log("API Response:", res);
          this.orders = res || [];
          this.loading = false;
        },
        error: (err) => {
          console.error("API Error:", err);
          this.error = 'Failed to load orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "Restaurant not logged in";
      this.loading = false;
    }
  }

  markPrepared(orderId: number) {
    const confirmed = confirm("Mark this order as prepared?");
    if (confirmed) {
      this.api.put(`Restaurant/Prepared/${orderId}`, {}).subscribe({
        next: (res) => {
          alert('Order marked as prepared!');
          // Refresh the orders list
          this.loadOrders();
        },
        error: (err) => {
          console.error("Error marking prepared:", err);
          alert('Failed to mark order as prepared.');
        }
      });
    }
  }
}
