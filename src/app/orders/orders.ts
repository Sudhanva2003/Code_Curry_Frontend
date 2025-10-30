import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

interface OrderItem {
  foodId: number;
  quantity: number;
  price: number;
  foodName: string;
}

interface Order {
  orderId: number;
  userId: number;
  restId: number;
  delivererId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  platformFee: number;
  handlingFee: number;
  deliveryFee: number;
  gst: number;
  finalPrice: number;
  items: OrderItem[];
  restaurantRating: number | null;
  delivererRating: number | null;
  restaurantRated: boolean;
  delivererRated: boolean;
}

@Component({
  selector: 'orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class Orders implements OnInit {
  openOrders: Order[] = [];
  pastOrders: Order[] = [];
  filteredPastOrders: Order[] = [];
  currentPage = 1;
  pageSize = 5;
  loading = true;
  error = '';
  userId: number = 0;
  currentDate = new Date();
  today = new Date();
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user?.userId) {
      this.userId = user.userId;
      this.api.get(`Customer/ViewUserOrders/${this.userId}`).subscribe({
        next: (res: any) => {
          this.openOrders = (res.openOrders || []).map((order: any) => ({
            ...order,
            restaurantRating: null,
            delivererRating: null,
            restaurantRated: false,
            delivererRated: false
          }));
          this.pastOrders = (res.pastOrders || []).map((order: any) => ({
            ...order,
            restaurantRating: null,
            delivererRating: null,
            restaurantRated: false,
            delivererRated: false
          }));
          this.loading = false;
          this.getFilteredOrders();
        },
        error: () => {
          this.error = 'Failed to load orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "User not logged in";
      this.loading = false;
    }
  }

  refreshOrders() {
    this.loading = true;
    this.api.get(`Customer/ViewUserOrders/${this.userId}`).subscribe({
      next: (res: any) => {
        this.openOrders = (res.openOrders || []).filter((order: any) =>
          order.status === 'Paid'|| 
        order.status === 'Prepared' ||
        order.status =='Assigned' 
        ).map((order: any) => ({
          ...order,
          restaurantRating: null,
          delivererRating: null,
          restaurantRated: false,
          delivererRated: false
        }));

        this.pastOrders = (res.pastOrders || []).filter((order: any) =>
          order.status === 'Delivered' ||
           order.status === 'CancelledByCustomer'||
          order.status === 'CancelledByRest'||
          order.status === 'CancelledByDeliverer'
        ).map((order: any) => ({
          ...order,
          restaurantRating: null,
          delivererRating: null,
          restaurantRated: false,
          delivererRated: false
        }));

        this.getFilteredOrders();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to reload orders';
        this.loading = false;
      }
    });
  }

  cancelOrder(orderId: number): void {
  const confirmed = confirm("Are you sure you want to cancel this order?");
  if (!confirmed) return;

  this.api.put(`Customer/CancelOrder/${orderId}`, {}).subscribe({
    next: () => {
      alert('Order cancelled successfully.');
      this.refreshOrders(); // ✅ reloads open + past
    },
    error: (err) => {
      console.error("Cancel error:", err);
      alert('Failed to cancel order.');
    }
  });
}


  get currentMonth(): string {
    return this.monthNames[this.currentDate.getMonth()];
  }

  get currentYear(): number {
    return this.currentDate.getFullYear();
  }

  get prevMonthLabel(): string {
    const prev = new Date(this.currentDate);
    prev.setMonth(prev.getMonth() - 1);
    return `${this.monthNames[prev.getMonth()]} ${prev.getFullYear()}`;
  }

  get nextMonthLabel(): string {
    const next = new Date(this.currentDate);
    next.setMonth(this.currentDate.getMonth() + 1);
    return `${this.monthNames[next.getMonth()]} ${next.getFullYear()}`;
  }

  canGoNext(): boolean {
    return (
      this.currentDate.getMonth() < this.today.getMonth() ||
      this.currentDate.getFullYear() < this.today.getFullYear()
    );
  }

  goToPrevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.currentPage = 1;
    this.getFilteredOrders();
  }

  goToNextMonth() {
    if (this.canGoNext()) {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.currentPage = 1;
      this.getFilteredOrders();
    }
  }

  getFilteredOrders() {
    const month = this.currentMonth.toLowerCase();
    const year = this.currentYear;
    const filtered = this.pastOrders.filter(order => {
      if (!order.orderDate) return false;
      const date = new Date(order.orderDate);
      const orderMonth = date.toLocaleString('default', { month: 'long' }).toLowerCase();
      return orderMonth === month && date.getFullYear() === year;
    });

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredPastOrders = filtered.slice(start, end);
  }

  get totalPages(): number {
    const month = this.currentMonth.toLowerCase();
    const year = this.currentYear;
    const filtered = this.pastOrders.filter(order => {
      if (!order.orderDate) return false;
      const date = new Date(order.orderDate);
      const orderMonth = date.toLocaleString('default', { month: 'long' }).toLowerCase();
      return orderMonth === month && date.getFullYear() === year;
    });
    return Math.ceil(filtered.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages && this.canGoNext()) {
      this.currentPage++;
      this.getFilteredOrders();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getFilteredOrders();
    }
  }

  canRateRestaurant(restId: number): boolean {
  return this.pastOrders.some(o => 
    o.restId === restId && 
    o.status === 'Delivered' && 
    o.restaurantRating === null
  );
}

canRateDeliverer(delivererId: number): boolean {
  return this.pastOrders.some(o => 
    o.delivererId === delivererId && 
    o.status === 'Delivered' && 
    o.delivererRating === null
  );
}

  submitRatingRestaurant(orderId: number, rating: number) {
    const endpoint = `Orders/SubmitRating?userId=${this.userId}&orderId=${orderId}&rating=${rating}`;

    this.api.post(endpoint, null).subscribe({
      next: (res: any) => {
        alert(res.message);
        const order = this.pastOrders.find(o => o.orderId === orderId);
        if (order) {
          order.restaurantRated = true;
        }
      },
      error: (err) => {
        console.error('Rating error:', err);
        alert(err?.error?.message || 'Rating failed. You may not be eligible.');
      }
    });
  }

  submitRatingDeliverer(orderId: number, rating: number) {
    const order = this.pastOrders.find(o => o.orderId === orderId);
    if (!order?.delivererId) {
      alert('Deliverer not found for this order.');
      return;
    }

    const endpoint = `Orders/SubmitDelivererRating?userId=${this.userId}&delivererId=${order.delivererId}&rating=${rating}`;

    this.api.post(endpoint, null).subscribe({
      next: (res: any) => {
        alert(res.message);
        const order = this.pastOrders.find(o => o.orderId === orderId);
        if (order) {
          order.delivererRated = true;
        }
      },
      error: (err) => {
        console.error('Rating error:', err);
        alert(err?.error?.message || 'Rating failed. You may not be eligible.');
      }
    });
  }
}
