import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

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
        },
      });
  }

  onPickupConfirm(): void {
    this.showPickupPopup = true;
  }

  confirmPickup(): void {
    this.isPickedUp = true;
    this.showPickupPopup = false;
    alert('All items picked up successfully!');
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
        alert(res); // shows "Order marked as delivered."
        this.showDeliveryPopup = false;
        localStorage.removeItem('currentOrderId');
        localStorage.removeItem('currentDelivererId');
      },
      error: (err) => {
        console.error('Failed to mark delivered', err);
        alert('Failed to mark delivery. Try again.');
      },
    });
}



  cancelDelivery(): void {
    this.showDeliveryPopup = false;
  }
}
