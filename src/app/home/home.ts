// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../api-service';
// import { Router } from '@angular/router';
// import { AuthGuard } from '../auth.guard';
// import { NotificationService } from '../notification.service';  // <-- import NotificationService

// @Component({
//   selector: 'home',
//   standalone: false,
//   templateUrl: './home.html',
//   styleUrls: ['./home.css']
// })
// export class Home implements OnInit {
//   restaurants: any[] = [];
//   menu: any[] = [];
//   filteredMenu: any[] = [];
//   selectedRestaurant: any = null;
//   loading = true;
//   error = '';

//   cartItems: any[] = [];
//   totalQuantity: number = 0;

//   searchTerm: string = '';
//   foodSearchTerm: string = '';
//   filterType: string = 'none';
//   foodSort: string = 'none';
//   restaurantSort: string = 'rating';

//   constructor(
//     private api: ApiService,
//     private router: Router,
//     private auth: AuthGuard,
//     private notificationService: NotificationService  // <-- inject NotificationService
//   ) {}

//   ngOnInit() {
//     this.fetchRestaurants();
//     const stored = localStorage.getItem('cart');
//     this.cartItems = stored ? JSON.parse(stored) : [];
//     this.updateTotal();
//   }

//   // ------------------- Fetch Restaurants -------------------
//   fetchRestaurants() {
//     this.loading = true;
//     this.api.get(`Filter/Restaurants?sort=${this.restaurantSort}`).subscribe({
//       next: (data: any) => {
//         this.restaurants = data.map((r: any) => ({
//           ...r,
//           restaurantStatus: r.restStatus || r.RestStatus || 'Open',
//           restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant'
//         }));
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.error = 'Failed to fetch restaurants';
//         this.loading = false;
//         this.notificationService.show('Failed to fetch restaurants', 3000);  // <-- replace alert
//       }
//     });
//   }

//   // ------------------- Restaurant Sort -------------------
//   applyRestaurantSort() {
//     this.fetchRestaurants(); // re-fetch sorted restaurants
//   }

//   // ------------------- Search Restaurants and Foods -------------------
//   searchRestaurantsAndFoods() {
//     const term = this.searchTerm.trim();
//     if (!term) {
//       this.fetchRestaurants();
//       return;
//     }

//     this.loading = true;
//     this.error = '';

//     const restaurantSearch = this.api.get(`Restaurant/Search?name=${this.searchTerm}`);
//     const foodRestaurantSearch = this.api.get(`Foods/SearchRestaurantsByFoodName?name=${this.searchTerm}`);
//     const cuisineSearch = this.api.get(`Filter/SearchByCuisine?cuisine=${this.searchTerm}`);

//     Promise.all([
//       restaurantSearch.toPromise(),
//       foodRestaurantSearch.toPromise(),
//       cuisineSearch.toPromise()
//     ])
//       .then(([restaurantMatches, foodRestaurantMatches, cuisineMatches]: any) => {
//         const formattedRestaurants = restaurantMatches.map((r: any) => ({
//           ...r,
//           restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
//           type: 'restaurant'
//         }));

//         const formattedFoodRestaurants = foodRestaurantMatches.map((r: any) => ({
//           ...r,
//           restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
//           type: 'restaurant',
//           matchedFood: this.searchTerm
//         }));

//         const formattedCuisineRestaurants = cuisineMatches.map((r: any) => ({
//           ...r,
//           restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
//           type: 'restaurant',
//           matchedCuisine: this.searchTerm
//         }));

//         const allRestaurants = [
//           ...formattedRestaurants,
//           ...formattedFoodRestaurants,
//           ...formattedCuisineRestaurants
//         ];

//         const uniqueRestaurants = allRestaurants.filter((r, index, self) =>
//           index === self.findIndex(other => other.restId === r.restId)
//         );

//         this.restaurants = uniqueRestaurants;
//         this.loading = false;
//       })
//       .catch((err) => {
//         console.error('Search failed:', err);
//         this.error = 'Search failed';
//         this.loading = false;
//         this.notificationService.show('Search failed', 3000);  // <-- replace alert
//       });
//   }

//   // ------------------- Search Foods inside a Restaurant -------------------
//   searchFoodsInRestaurant() {
//     if (!this.menu || !this.foodSearchTerm.trim()) {
//       this.filteredMenu = [...this.menu];
//       return;
//     }

//     const term = this.foodSearchTerm.toLowerCase();
//     this.filteredMenu = this.menu.filter(f =>
//       f.name.toLowerCase().includes(term) ||
//       f.description?.toLowerCase().includes(term) ||
//       f.category?.toLowerCase().includes(term)
//     );
//   }

//   // ------------------- Filter -------------------
//   applyFilter() {
//     if (!this.menu) return;

//     let result: any[] = [];

//     if (this.filterType === '' || this.filterType === 'none') {
//       result = [...this.menu];
//     } 
//     else if (this.filterType.toLowerCase() === 'veg') {
//       result = this.menu.filter(
//         (f) => f.category?.toLowerCase() === 'veg' || f.category?.toLowerCase() === 'vegan'
//       );
//     } 
//     else {
//       result = this.menu.filter(
//         (f) => f.category?.toLowerCase() === this.filterType.toLowerCase()
//       );
//     }

//     if (this.foodSort === 'price') {
//       result.sort((a, b) => a.price - b.price);
//     }

//     this.filteredMenu = result;
//   }

//   // ------------------- Sort -------------------
//   applySort() {
//     this.applyFilter();
//   }

//   // ------------------- Restaurant Selection -------------------
//   selectRestaurant(r: any) {
//     if (r.restaurantStatus === 'Closed') return;

//     this.selectedRestaurant = r;
//     this.loading = true;
//     this.api.get(`Filter/Foods?restId=${r.restId}&category=${this.filterType}&sort=${this.foodSort}`).subscribe({
//       next: (data: any) => {
//         this.menu = data.map((m: any) => ({
//           ...m,
//           quantity: 0,
//           restId: r.restId,
//           foodImageUrl: m.foodImageUrl || 'https://via.placeholder.com/200x150?text=Food'
//         }));
//         this.filteredMenu = [...this.menu];
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.error = 'Failed to fetch menu';
//         this.loading = false;
//         this.notificationService.show('Failed to fetch menu', 3000);  // <-- replace alert
//       }
//     });
//   }

//   // ------------------- Back to Restaurants -------------------
//   backToRestaurants() {
//     this.selectedRestaurant = null;
//     this.menu = [];
//     this.filteredMenu = [];
//   }

//   // ------------------- Cart Management -------------------
//   incrementItem(item: any) {
//     item.quantity++;
//     this.updateCart(item);
//   }

//   decrementItem(item: any) {
//     if (item.quantity > 0) {
//       item.quantity--;
//       this.updateCart(item);
//     }
//   }

//   updateCart(item: any) {
//     const idx = this.cartItems.findIndex((ci) => ci.foodId === item.foodId && ci.restId === item.restId);
//     if (item.quantity > 0) {
//       if (idx === -1) {
//         this.cartItems.push({
//           foodId: item.foodId,
//           quantity: item.quantity,
//           restId: item.restId,
//           name: item.name,
//           price: item.price
//         });
//       } else {
//         this.cartItems[idx].quantity = item.quantity;
//       }
//     } else {
//       if (idx !== -1) this.cartItems.splice(idx, 1);
//     }
//     this.updateTotal();
//     localStorage.setItem('cart', JSON.stringify(this.cartItems));
//   }

//   updateTotal() {
//     this.totalQuantity = this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
//   }

//   // ------------------- Navigation -------------------
//   goToCart() {
//     this.router.navigate(['customer/cart']);
//   }

//   // ------------------- Place Order -------------------
//   placeOrder() {
//     const user = this.auth.getUser();
//     if (!user) {
//       this.notificationService.show('Please login first', 3000);  // <-- replace alert
//       return;
//     }

//     const payload = {
//       userId: user.userId,
//       orderItems: this.cartItems.map((i) => ({
//         foodId: i.foodId,
//         quantity: i.quantity
//       }))
//     };

//     this.api.post('Orders/placeOrder', payload).subscribe({
//       next: () => {
//         this.notificationService.show('Order placed successfully!', 3000);  // <-- replace alert
//         this.cartItems = [];
//         this.totalQuantity = 0;
//         localStorage.removeItem('cart');
//         this.router.navigate(['customer/orders']);
//       },
//       error: (err) => {
//         console.error(err);
//         this.notificationService.show('Failed to place order.', 3000);  // <-- replace alert
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { NotificationService } from '../notification.service';  // <-- import NotificationService

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
    private auth: AuthGuard,
    private notificationService: NotificationService  // <-- inject NotificationService
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
          restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
          distance: null  // Initialize distance as null
        }));
        this.getDistanceForRestaurants();  // Fetch distances for each restaurant
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch restaurants';
        this.loading = false;
      }
    });
  }

  // ------------------- Get Distance for Each Restaurant -------------------
  getDistanceForRestaurants() {
    // Get user info to fetch their address
    const user = this.auth.getUser();
    if (!user || !user.userId) {
      console.warn('User not logged in, cannot fetch distances');
      // Set default distance for all restaurants
      this.restaurants.forEach(restaurant => {
        restaurant.distance = 'N/A';
      });
      return;
    }

    // Fetch user details to get their address
    this.api.get(`customer/ViewUser/${user.userId}`).subscribe({
      next: (userData: any) => {
        const customerAddress = userData.address || 'Default Address';

        // Now fetch distance for each restaurant
        this.restaurants.forEach((restaurant) => {
          this.api.get(`customer/Distance?restAddress=${encodeURIComponent(restaurant.address)}&customerAddress=${encodeURIComponent(customerAddress)}`).subscribe({
            next: (distance: number) => {
              restaurant.distance = distance;  // Assign the distance to each restaurant
            },
            error: (error) => {
              console.error('Error fetching distance for restaurant:', restaurant.name, error);
              restaurant.distance = 'N/A';  // Set N/A if distance fetch fails
            }
          });
        });
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        // Set default distance for all restaurants
        this.restaurants.forEach(restaurant => {
          restaurant.distance = 'N/A';
        });
      }
    });
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
          type: 'restaurant',
          distance: null  // Initialize distance as null
        }));

        const formattedFoodRestaurants = foodRestaurantMatches.map((r: any) => ({
          ...r,
          restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
          type: 'restaurant',
          matchedFood: this.searchTerm,
          distance: null
        }));

        const formattedCuisineRestaurants = cuisineMatches.map((r: any) => ({
          ...r,
          restImageUrl: r.restImageUrl || 'https://via.placeholder.com/200x150?text=Restaurant',
          type: 'restaurant',
          matchedCuisine: this.searchTerm,
          distance: null
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
        this.getDistanceForRestaurants();  // Fetch distances for search results
        this.loading = false;
      })
      .catch((err) => {
        console.error('Search failed:', err);
        this.error = 'Search failed';
        this.loading = false;
      });
  }

  // ------------------- Restaurant Sort -------------------
  applyRestaurantSort() {
    this.fetchRestaurants();
  }

  // ------------------- Search for Food in Restaurants -------------------
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

  // ------------------- Filter Foods -------------------
  applyFilter() {
    if (!this.menu) return;

    let result =
      this.filterType === 'none'
        ? [...this.menu]
        : this.menu.filter((f) => f.category?.toLowerCase() === this.filterType.toLowerCase());

    if (this.foodSort === 'price') {
      result.sort((a, b) => a.price - b.price);
    }

    this.filteredMenu = result;
  }

  // ------------------- Apply Sorting -------------------
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
