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
  filteredMenu: any[] = [];
  selectedRestaurant: any = null;
  loading = true;
  error = '';

  cartItems: any[] = [];
  totalQuantity: number = 0;

  searchTerm: string = '';
  filterType: string = 'none';
  foodSort: string = 'none';
  restaurantSort: string = 'rating';

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthGuard
  ) {}

  ngOnInit() {
    this.fetchRestaurants();
    const stored = localStorage.getItem('cart');
    this.cartItems = stored ? JSON.parse(stored) : [];
    this.updateTotal();
  }

  // ------------------- Fetch Restaurants -------------------
  fetchRestaurants() {
    this.loading = true;
    this.api.get(`Filter/Restaurants?sort=${this.restaurantSort}`).subscribe({
      next: (data: any) => {
        this.restaurants = data.map((r: any) => {
          return {
            ...r,
            restaurantStatus: r.restStatus || r.RestStatus || 'Open',
            restImageUrl:
              r.restImageUrl ||
              'https://via.placeholder.com/200x150?text=Restaurant'
          };
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch restaurants';
        this.loading = false;
      }
    });
  }

  // ------------------- Restaurant Sort -------------------
  applyRestaurantSort() {
    this.fetchRestaurants();
  }

  // ------------------- Search -------------------
  searchRestaurantsAndFoods() {
    if (!this.searchTerm.trim()) {
      this.fetchRestaurants();
      return;
    }

    this.loading = true;
    this.error = '';

    const restaurantSearch = this.api.get(`Restaurant/Search?name=${this.searchTerm}`);
    const foodSearch = this.api.get(`Foods/Search?name=${this.searchTerm}`);

    Promise.all([restaurantSearch.toPromise(), foodSearch.toPromise()])
      .then(([restaurants, foods]: any) => {
        const formattedRestaurants = restaurants.map((r: any) => ({
          ...r,
          type: 'restaurant',
          restaurantStatus: r.restStatus || r.RestStatus || 'Open',
          restImageUrl:
            r.restImageUrl ||
            'https://via.placeholder.com/200x150?text=Restaurant'
        }));

        const formattedFoods = foods.map((f: any) => ({
          ...f,
          type: 'food',
          restImageUrl:
            f.foodImageUrl ||
            'https://via.placeholder.com/200x150?text=Food'
        }));

        this.restaurants = [...formattedRestaurants, ...formattedFoods];
        this.loading = false;
      })
      .catch((err) => {
        console.error(err);
        this.error = 'Search failed';
        this.loading = false;
      });
  }

  // ------------------- Filter -------------------
  applyFilter() {
    if (!this.menu) return;

    let result =
      this.filterType === 'none'
        ? [...this.menu]
        : this.menu.filter(
            (f) =>
              f.category?.toLowerCase() === this.filterType.toLowerCase()
          );

    if (this.foodSort === 'price') {
      result.sort((a, b) => a.price - b.price);
    }

    this.filteredMenu = result;
  }

  applySort() {
    this.applyFilter();
  }

  // ------------------- Restaurant Selection -------------------
  selectRestaurant(r: any) {
    if (r.restaurantStatus === 'Closed') return;

    this.selectedRestaurant = r;
    this.loading = true;
    this.api
      .get(
        `Filter/Foods?restId=${r.restId}&category=${this.filterType}&sort=${this.foodSort}`
      )
      .subscribe({
        next: (data: any) => {
          this.menu = data.map((m: any) => ({
            ...m,
            quantity: 0,
            restId: r.restId,
            foodImageUrl:
              m.foodImageUrl ||
              'https://via.placeholder.com/200x150?text=Food'
          }));
          this.filteredMenu = [...this.menu];
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
    this.filteredMenu = [];
  }

  // ------------------- Cart -------------------
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
    const idx = this.cartItems.findIndex(
      (ci) => ci.foodId === item.foodId && ci.restId === item.restId
    );
    if (item.quantity > 0) {
      if (idx === -1) {
        this.cartItems.push({
          foodId: item.foodId,
          quantity: item.quantity,
          restId: item.restId,
          name: item.name,
          price: item.price
        });
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
    this.totalQuantity = this.cartItems.reduce(
      (sum, i) => sum + i.quantity,
      0
    );
  }

  goToCart() {
    this.router.navigate(['customer/cart']);
  }

  placeOrder() {
    const user = this.auth.getUser();
    if (!user) {
      alert('Please login first');
      return;
    }

    const payload = {
      userId: user.userId,
      orderItems: this.cartItems.map((i) => ({
        foodId: i.foodId,
        quantity: i.quantity
      }))
    };

    this.api.post('Orders/placeOrder', payload).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.cartItems = [];
        this.totalQuantity = 0;
        localStorage.removeItem('cart');
        this.router.navigate(['customer/orders']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order.');
      }
    });
  }
}