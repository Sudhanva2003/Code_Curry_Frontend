import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';
import {Router} from '@angular/router';

@Component({
  selector: 'live-orders',
  standalone: false,
  templateUrl: './live-orders.html',
  styleUrls: ['./live-orders.css']
})
export class LiveOrders implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService, private auth: AuthGuard,private router:Router) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.api.get(`Deliverer/ViewLiveOrders`).subscribe({
      next: (res: any) => {
        console.log("API Response:", res);
        this.orders = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error("API Error:", err);
        this.error = 'Failed to load live orders';
        this.loading = false;
      }
    });
  }

  assignDelivery(orderId: number) {
    const delivererId = this.auth.getId(); // deliverer ID

    // Null / undefined check
    if (!delivererId) {
      alert('Deliverer ID not found. Please log in again.');
      return;
    }

    const confirmed = confirm("Assign this order for delivery?");
  
    if (confirmed) {
      const body = { delivererId }; // wrap in object
      this.api.put(`Deliverer/AssignOrder/${orderId}`, body).subscribe({
        next: (res) => {
          alert('Order assigned for delivery!');
          // Save delivererId and orderId to localStorage
          localStorage.setItem('currentOrderId', orderId.toString());
          localStorage.setItem('currentDelivererId', delivererId.toString());
          this.loadOrders();
           this.router.navigate(['deliverer/delivery']);
        },
        error: (err) => {
          console.error("Error assigning delivery:", err);
          alert('Failed to assign delivery.');
        }
      });
    }
  }
}
