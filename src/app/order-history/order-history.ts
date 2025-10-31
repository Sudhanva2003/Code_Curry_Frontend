import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  status: string;
  finalPrice: number;
  handlingFee: number;
  deliveryFee: number;
  gst: number;
  totalAmount: number;
  items: OrderItem[];
  restaurantRating?: number;
  delivererRating?: number;
  restaurantRated?: boolean;
  delivererRated?: boolean;
}

@Component({
  selector: 'order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistory implements OnInit {
  pastOrders: Order[] = [];
  filteredPastOrders: Order[] = [];
  currentPage = 1;
  pageSize = 5;
  selectedMonth = 'October';
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  loading = true;
  error = '';

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    const restId = this.auth.getId();
    if (restId) {
      this.api.get(`Restaurant/ViewRestaurantPastOrders/${restId}`).subscribe({
        next: (res: Order[]) => {
          this.pastOrders = (res || []).filter((order: Order) =>
            ['Delivered', 'Prepared', 'CancelledByRest', 'CancelledByCustomer', 'CancelledByDeliverer'].includes(order.status)
          );
          this.loading = false;
          this.getFilteredOrders();
        },
        error: () => {
          this.error = 'Failed to load past orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "Restaurant not logged in";
      this.loading = false;
    }
  }

  getFilteredOrders(): void {
    const month = this.selectedMonth.toLowerCase();
    const filtered = this.pastOrders.filter((order: Order) => {
      if (!order.orderDate) return false;
      const orderMonth = new Date(order.orderDate).toLocaleString('default', { month: 'long' }).toLowerCase();
      return orderMonth === month;
    });

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredPastOrders = filtered.slice(start, end);
  }

  get totalPages(): number {
    const month = this.selectedMonth.toLowerCase();
    const filtered = this.pastOrders.filter((order: Order) => {
      if (!order.orderDate) return false;
      const orderMonth = new Date(order.orderDate).toLocaleString('default', { month: 'long' }).toLowerCase();
      return orderMonth === month;
    });
    return Math.ceil(filtered.length / this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getFilteredOrders();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getFilteredOrders();
    }
  }

  // Month navigation
  changeToNextMonth(): void {
    const currentIndex = this.months.indexOf(this.selectedMonth);
    this.selectedMonth = this.months[(currentIndex + 1) % this.months.length];
    this.currentPage = 1;
    this.getFilteredOrders();
  }

  changeToPrevMonth(): void {
    const currentIndex = this.months.indexOf(this.selectedMonth);
    this.selectedMonth =
      this.months[(currentIndex - 1 + this.months.length) % this.months.length];
    this.currentPage = 1;
    this.getFilteredOrders();
  }

  // Reload orders after cancel or rating
  loadOrders(): void {
    const restId = this.auth.getId();
    if (restId) {
      this.api.get(`Restaurant/ViewRestaurantPastOrders/${restId}`).subscribe({
        next: (res: Order[]) => {
          this.pastOrders = res || [];
          this.loading = false;
          this.getFilteredOrders();
        },
        error: () => {
          this.error = 'Failed to load past orders';
          this.loading = false;
        }
      });
    }
  }

  submitRatingRestaurant(orderId: number, rating: number): void {
    this.api.post(`Restaurant/RateRestaurant/${orderId}`, { rating }).subscribe({
      next: () => {
        alert('Restaurant rated successfully!');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error rating restaurant:', err);
        alert('Failed to rate restaurant.');
      }
    });
  }

  submitRatingDeliverer(orderId: number, rating: number): void {
    this.api.post(`Deliverer/RateDeliverer/${orderId}`, { rating }).subscribe({
      next: () => {
        alert('Deliverer rated successfully!');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Error rating deliverer:', err);
        alert('Failed to rate deliverer.');
      }
    });
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.api.delete(`Restaurant/CancelOrder/${orderId}`).subscribe({
        next: () => {
          alert('Order canceled successfully.');
          this.loadOrders();
        },
        error: (err) => {
          console.error('Error canceling order:', err);
          alert('Failed to cancel order.');
        }
      });
    }
  }
}
