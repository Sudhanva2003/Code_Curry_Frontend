import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  showPayPopup: boolean = false;

  constructor(private router: Router, private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    const stored = localStorage.getItem('cart');
    this.cartItems = stored ? JSON.parse(stored) : [];
    this.updateTotal();
  }

  updateTotal() {
    this.totalAmount = this.roundToTwo(this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0));
  }

  incrementItem(item: any) {
    item.quantity++;
    this.updateCartStorage();
  }

  decrementItem(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
      if (item.quantity === 0) {
        this.cartItems = this.cartItems.filter(ci => ci.foodId !== item.foodId);
      }
      this.updateCartStorage();
    }
  }

  updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.updateTotal();
  }

  openPaymentPopup() {
    this.showPayPopup = true;
  }

  cancelPay() {
    this.showPayPopup = false;
  }

  // Helper function for rounding to 2 decimals
  roundToTwo(value: number): number {
    return Math.round(value * 100) / 100;
  }

  // ---- Additional calculated getters ----
  get itemCount(): number {
    return this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  get PlatformCharges(): number {
    return this.roundToTwo(this.totalAmount * 0.02); // 2% platform fee
  }

  get handlingCharges(): number {
    return this.roundToTwo(this.itemCount * 5);
  }

  get deliveryCharges(): number {
    const uniqueRestaurants = new Set(this.cartItems.map(item => item.restId));
    return this.roundToTwo(50 * uniqueRestaurants.size); // ₹50 per unique restaurant
  }

  get cgst(): number {
    return this.roundToTwo(this.totalAmount * 0.09);
  }

  get sgst(): number {
    return this.roundToTwo(this.totalAmount * 0.09);
  }

  get finalTotal(): number {
    const total = this.totalAmount +
                  this.PlatformCharges +
                  this.handlingCharges +
                  this.deliveryCharges +
                  this.cgst +
                  this.sgst;
    return this.roundToTwo(total);
  }

  confirmPay() {
    const user = this.auth.getUser();
    if (!user) {
      alert('Please login first');
      return;
    }

    const payload = {
      userId: user.userId,
      orderItems: this.cartItems.map(i => ({
        foodId: i.foodId,
        quantity: i.quantity
      }))
    };

    this.api.post('Orders/PlaceOrder', payload).subscribe({
      next: (res) => {
        alert('Order placed successfully!');
        this.showPayPopup = false;
        this.cartItems = [];
        this.totalAmount = 0;
        localStorage.removeItem('cart');
        this.router.navigate(['/customer/orders']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order.');
      }
    });
  }
}
