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
    this.totalAmount = this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
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
        this.router.navigate(['/user/orders']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order.');
      }
    });
  }
}
