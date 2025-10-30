import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  status: string;
  finalPrice: number;
  items: OrderItem[];
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
            order.status === 'Delivered' ||
            order.status === 'Prepared' ||
            order.status === 'CancelledByRest'||
            order.status === 'CancelledByCustomer'
            ||
            order.status === 'CancelledByDeliverer'
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

  changeMonth(month: string): void {
    this.selectedMonth = month;
    this.currentPage = 1;
    this.getFilteredOrders();
  }
}
