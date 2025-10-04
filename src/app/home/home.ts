import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  restaurants: any[] = [];
  menu: any[] = [];
  selectedRestaurant: any = null;
  loading = true;
  error = '';

  cartItems: any[] = [];
  totalQuantity: number = 0;

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthGuard
  ) {}

  ngOnInit() {
    this.fetchRestaurants();
    // Load cart from localStorage if any
    const stored = localStorage.getItem('cart');
    this.cartItems = stored ? JSON.parse(stored) : [];
    this.updateTotal();
  }

  fetchRestaurants() {
    this.loading = true;
    this.api.get('Restaurant/Home').subscribe({
      next: (data) => {
        this.restaurants = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch restaurants';
        this.loading = false;
      }
    });
  }

  selectRestaurant(r: any) {
    this.selectedRestaurant = r;
    this.loading = true;
    this.api.get(`Restaurant/Menu/${r.restId}`).subscribe({
      next: (data) => {
        // Add quantity and restId to each menu item
        this.menu = data.map((m: any) => ({
          ...m,
          quantity: 0,
          restId: r.restId
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch menu';
        this.loading = false;
      }
    });
  }

  backToRestaurants() {
    this.selectedRestaurant = null;
    this.menu = [];
  }

  incrementItem(item: any) {
    item.quantity++;
    this.updateCart(item);
  }

  decrementItem(item: any) {
    if (item.quantity > 0) {
      item.quantity--;
      this.updateCart(item);
    }
  }

  updateCart(item: any) {
    let idx = this.cartItems.findIndex(ci => ci.foodId === item.foodId && ci.restId === item.restId);
    if (item.quantity > 0) {
      if (idx === -1) {
        this.cartItems.push({ foodId: item.foodId, quantity: item.quantity, restId: item.restId, name: item.name, price: item.price });
      } else {
        this.cartItems[idx].quantity = item.quantity;
      }
    } else {
      if (idx !== -1) this.cartItems.splice(idx, 1);
    }

    this.updateTotal();
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  updateTotal() {
    this.totalQuantity = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  goToCart() {
    this.router.navigate(['user/cart']);
  }

  // ✅ Place order API call
  placeOrder() {
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
    
    this.api.post('Orders/placeOrder', payload).subscribe({
      next: (res) => {
        alert('Order placed successfully!');
        // Clear cart after order
        this.cartItems = [];
        this.totalQuantity = 0;
        localStorage.removeItem('cart');
        this.router.navigate(['user/orders']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order.');
      }
    });
  }
}
