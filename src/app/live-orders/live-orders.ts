import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

interface Order {
  orderId: number;
  status: string;
  restaurantAddress: string;
  customerAddress: string;
}

@Component({
  selector: 'live-orders',
  standalone: false,
  templateUrl: './live-orders.html',
  styleUrls: ['./live-orders.css']
})
export class LiveOrders implements OnInit {
  orders: Order[] = [];
  deliveredOrders: Order[] = []; // ✅ Added to hold completed/cancelled orders
  loading = true;
  error = '';

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.api.get(`Deliverer/ViewLiveOrders`).subscribe({
      next: (res: Order[]) => {
        this.orders = (res || []).filter((order: Order) =>
          order.status === 'Paid' ||
          order.status === 'Prepared' 
        );
        this.loading = false;
      },
      error: (err) => {
        console.error("API Error:", err);
        this.error = 'Failed to load live orders';
        this.loading = false;
      }
    });
  }
   cancelOrder(orderId: number): void {
    const confirmed = confirm("Are you sure you want to cancel this delivery?");
    if (!confirmed) return;

    this.api.put(`Deliverer/CancelOrder/${orderId}`, {}).subscribe({
      next: () => {
        alert("Order cancelled.");
        this.loadOrders();
      },
      error: (err) => {
        console.error("Cancel error:", err);
        alert("Failed to cancel order.");
      }
    });
  }

  assignDelivery(orderId: number): void {
    const delivererId = this.auth.getId();
    if (!delivererId) {
      alert('Deliverer ID not found. Please log in again.');
      return;
    }

    const confirmed = confirm("Assign this order for delivery?");
    if (!confirmed) return;

    const body = { delivererId };
    this.api.put(`Deliverer/AssignOrder/${orderId}`, body).subscribe({
      next: () => {
        alert('Order assigned for delivery!');
        localStorage.setItem('currentOrderId', orderId.toString());
        localStorage.setItem('currentDelivererId', delivererId.toString());
        this.loadOrders();
      },
      error: (err) => {
        console.error("Error assigning delivery:", err);
        alert('Failed to assign delivery.');
      }
    });
  }

 

}
