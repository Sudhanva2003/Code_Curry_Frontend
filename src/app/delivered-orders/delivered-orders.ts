import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'delivered-orders',
  standalone: false,
  templateUrl: './delivered-orders.html',
  styleUrls: ['./delivered-orders.css']
})
export class DeliveredOrders implements OnInit {
  deliveredOrders: any[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    const delivererId = this.auth.getId(); // deliverer ID
    if (delivererId) {
      this.api.get(`Deliverer/ViewDeliveredOrders/${delivererId}`).subscribe({
        next: (res: any) => {
          console.log("API Response:", res);
          this.deliveredOrders = res || [];
          this.loading = false;
        },
        error: (err) => {
          console.error("API Error:", err);
          this.error = 'Failed to load delivered orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "Deliverer not logged in";
      this.loading = false;
    }
  }
}
