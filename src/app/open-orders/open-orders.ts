import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';
import { NotificationService } from '../notification.service'; // <-- Import NotificationService

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

  constructor(
    private api: ApiService, 
    private auth: AuthGuard, 
    private notificationService: NotificationService // <-- Inject NotificationService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    const restId = this.auth.getId(); // restaurant ID
    if (restId) {
      this.api.get(`Restaurant/ViewRestaurantOpenOrders/${restId}`).subscribe({
        next: (res: any[]) => {
          console.log("API Response:", res);
          this.orders = (res || []).filter(order =>
            order.status === 'Paid' || 
            order.status === 'Assigned'
          );
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
        next: () => {
          this.notificationService.show('Order marked as prepared!', 3000);
          this.loadOrders();
        },
        error: (err) => {
          console.error("Error marking prepared:", err);
          this.notificationService.show('Failed to mark order as prepared.', 3000);
        }
      });
    }
  }

  cancelOrder(orderId: number) {
    const confirmed = confirm("Are you sure you want to cancel this order?");
    if (confirmed) {
      this.api.put(`Restaurant/CancelOrder/${orderId}`, {}).subscribe({
        next: () => {
          this.notificationService.show('Order cancelled successfully.', 3000);
          this.loadOrders();
        },
        error: (err) => {
          console.error("Error cancelling order:", err);
          this.notificationService.show('Failed to cancel order.', 3000);
        }
      });
    }
  }

  markNoted(orderId: number) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order || order.status !== 'CancelledByRest') {
      this.notificationService.show('This order was not cancelled by the restaurant.', 3000);
      return;
    }

    const confirmed = confirm("Move this cancelled order to history?");
    if (confirmed) {
      this.api.put(`Restaurant/Noted/${orderId}`, {}).subscribe({
        next: () => {
          this.notificationService.show('Order marked as noted.', 3000);
          this.loadOrders();
        },
        error: (err) => {
          console.error("Error marking noted:", err);
          this.notificationService.show(err?.error || 'Failed to mark order as noted.', 3000);
        }
      });
    }
  }
}
