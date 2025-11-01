import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '../notification.service'; // <-- Import NotificationService

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.html',
  styleUrls: ['./delivery.css'],
  standalone: false
})
export class Delivery implements OnInit {
  orderId!: number;
  DelivererId!: number;
  deliveryDetail: any = null;
  showPickupPopup = false;
  showDeliveryPopup = false;
  isPickedUp = false;

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private notificationService: NotificationService // <-- Inject NotificationService
  ) {}

  ngOnInit(): void {
    // Fetch orderId and delivererId from localStorage
    this.orderId = Number(localStorage.getItem('currentOrderId'));
    this.DelivererId = Number(localStorage.getItem('currentDelivererId'));

    if (!this.orderId || !this.DelivererId) {
      console.error('No active delivery found in localStorage');
      return;
    }

    this.fetchDeliveryDetails();
  }

  fetchDeliveryDetails(): void {
    this.http
      .get(`https://localhost:7265/api/Deliverer/DeliveryDetail/${this.orderId}`)
      .subscribe({
        next: (data: any) => {
          this.deliveryDetail = data;
        },
        error: (err) => {
          console.error('Failed to load delivery details', err);
          this.notificationService.show('Failed to load delivery details. Please try again.'); // <-- Use NotificationService
        },
      });
  }

  onPickupConfirm(): void {
    this.showPickupPopup = true;
  }

  confirmPickup(): void {
    this.isPickedUp = true;
    this.showPickupPopup = false;
    this.notificationService.show('All items picked up successfully!'); // <-- Use NotificationService
  }

  cancelPickup(): void {
    this.showPickupPopup = false;
  }

  onDeliveryConfirm(): void {
    this.showDeliveryPopup = true;
  }

  confirmDelivery(): void {
    this.http
      .put(`https://localhost:7265/api/Deliverer/MarkDelivered/${this.orderId}`, {}, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.notificationService.show(res); // <-- Use NotificationService
          this.showDeliveryPopup = false;
          localStorage.removeItem('currentOrderId');
          localStorage.removeItem('currentDelivererId');
          this.router.navigate(['/deliverer/delivered-orders']);
        },
        error: (err) => {
          console.error('Failed to mark delivered', err);
          this.notificationService.show('Failed to mark delivery. Try again.'); // <-- Use NotificationService
        },
      });
  }

  cancelDelivery(): void {
    this.showDeliveryPopup = false;
  }

  cancelOrder(): void {
    const confirmed = confirm('Are you sure you want to cancel this delivery?');
    if (!confirmed) return;

    this.http
      .put(`https://localhost:7265/api/Deliverer/CancelOrder/${this.orderId}`, {}, { responseType: 'text' })
      .subscribe({
        next: (res) => {
          this.notificationService.show(res); // <-- Use NotificationService
          localStorage.removeItem('currentOrderId');
          localStorage.removeItem('currentDelivererId');
          this.deliveryDetail = null;
        },
        error: (err) => {
          console.error('Failed to cancel delivery', err);
          this.notificationService.show('Failed to cancel delivery. Try again.'); // <-- Use NotificationService
        },
      });
  }
}
