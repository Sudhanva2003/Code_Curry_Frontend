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
  foodSearchTerm: string = '';
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
        this.restaurants = data.map((r: any) => ({
          ...r,
          restaurantStatus: r.restStatus || r.RestStatus || 'Open',
          restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant'
        }));
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
    this.fetchRestaurants(); // re-fetch sorted restaurants
  }

  // ------------------- Search Restaurants and Foods -------------------
  searchRestaurantsAndFoods() {
    const term = this.searchTerm.trim();
    if (!term) {
      this.fetchRestaurants();
      return;
    }

    this.loading = true;
    this.error = '';

    const restaurantSearch = this.api.get(`Restaurant/Search?name=${this.searchTerm}`);
    const foodRestaurantSearch = this.api.get(`Foods/SearchRestaurantsByFoodName?name=${this.searchTerm}`);
    const cuisineSearch = this.api.get(`Filter/SearchByCuisine?cuisine=${this.searchTerm}`);

    Promise.all([
      restaurantSearch.toPromise(),
      foodRestaurantSearch.toPromise(),
      cuisineSearch.toPromise()
    ])
      .then(([restaurantMatches, foodRestaurantMatches, cuisineMatches]: any) => {
        const formattedRestaurants = restaurantMatches.map((r: any) => ({
          ...r,
          restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
          type: 'restaurant'
        }));

        const formattedFoodRestaurants = foodRestaurantMatches.map((r: any) => ({
          ...r,
          restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
          type: 'restaurant',
          matchedFood: this.searchTerm
        }));

        const formattedCuisineRestaurants = cuisineMatches.map((r: any) => ({
          ...r,
          restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
          type: 'restaurant',
          matchedCuisine: this.searchTerm
        }));

        const allRestaurants = [
          ...formattedRestaurants,
          ...formattedFoodRestaurants,
          ...formattedCuisineRestaurants
        ];

        const uniqueRestaurants = allRestaurants.filter((r, index, self) =>
          index === self.findIndex(other => other.restId === r.restId)
        );

        this.restaurants = uniqueRestaurants;
        this.loading = false;
      })
      .catch((err) => {
        console.error('Search failed:', err);
        this.error = 'Search failed';
        this.loading = false;
      });
  }

  // ------------------- Search Foods inside a Restaurant -------------------
  searchFoodsInRestaurant() {
    if (!this.menu || !this.foodSearchTerm.trim()) {
      this.filteredMenu = [...this.menu];
      return;
    }

    const term = this.foodSearchTerm.toLowerCase();
    this.filteredMenu = this.menu.filter(f =>
      f.name.toLowerCase().includes(term) ||
      f.description?.toLowerCase().includes(term) ||
      f.category?.toLowerCase().includes(term)
    );
  }

  // ------------------- Filter -------------------
  applyFilter() {
    if (!this.menu) return;

    let result: any[] = [];

    if (this.filterType === '' || this.filterType === 'none') {
      result = [...this.menu];
    } 
    else if (this.filterType.toLowerCase() === 'veg') {
      // Include both veg and vegan
      result = this.menu.filter(
        (f) =>
          f.category?.toLowerCase() === 'veg' ||
          f.category?.toLowerCase() === 'vegan'
      );
    } 
    else {
      // Normal filtering for other categories
      result = this.menu.filter(
        (f) => f.category?.toLowerCase() === this.filterType.toLowerCase()
      );
    }

    // Apply sorting if needed
    if (this.foodSort === 'price') {
      result.sort((a, b) => a.price - b.price);
    }

    this.filteredMenu = result;
  }

  // ------------------- Sort -------------------
  applySort() {
    this.applyFilter(); // Re-apply filter with sort
  }

  // ------------------- Restaurant Selection -------------------
  selectRestaurant(r: any) {
    if (r.restaurantStatus === 'Closed') return;

    this.selectedRestaurant = r;
    this.loading = true;
    this.api.get(`Filter/Foods?restId=${r.restId}&category=${this.filterType}&sort=${this.foodSort}`).subscribe({
      next: (data: any) => {
        this.menu = data.map((m: any) => ({
          ...m,
          quantity: 0,
          restId: r.restId,
          foodImageUrl: m.foodImageUrl || 'https://via.placeholder.com/200x150?text=Food'
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

  // ------------------- Back to Restaurants -------------------
  backToRestaurants() {
    this.selectedRestaurant = null;
    this.menu = [];
    this.filteredMenu = [];
  }

  // ------------------- Cart Management -------------------
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
    const idx = this.cartItems.findIndex((ci) => ci.foodId === item.foodId && ci.restId === item.restId);
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
    this.totalQuantity = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  // ------------------- Navigation -------------------
  goToCart() {
    this.router.navigate(['customer/cart']);
  }

  // ------------------- Place Order -------------------
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
