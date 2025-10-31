import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

interface Order {
  orderId: number;
  orderDate: string;
  status: string;
  restaurantAddress: string;
  customerAddress: string;
  deliveryFee: number;
}

@Component({
  selector: 'delivered-orders',
  standalone: false,
  templateUrl: './delivered-orders.html',
  styleUrls: ['./delivered-orders.css']
})
export class DeliveredOrders implements OnInit {
  deliveredOrders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  error = '';

  selectedMonth = 'October'; // default month
  currentPage = 1;
  pageSize = 5;

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit(): void {
    const delivererId = this.auth.getId();
    if (delivererId) {
      this.api.get(`Deliverer/ViewDeliveredOrders/${delivererId}`).subscribe({
        next: (res: Order[]) => {
          const validStatuses = [
            'Delivered',
            'CancelledByCustomer',
            'CancelledByRest',
            'CancelledByDeliverer'
          ];

          this.deliveredOrders = (res || []).filter((order: Order) =>
            validStatuses.includes(order.status)
          );

          this.loading = false;
          this.applyFilters();
        },
        error: (err) => {
          console.error('Error loading delivered orders:', err);
          this.error = 'Failed to load delivered orders';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Deliverer not logged in';
      this.loading = false;
    }
  }

  applyFilters(): void {
    const month = this.selectedMonth.toLowerCase();
    this.filteredOrders = this.deliveredOrders.filter((order: Order) => {
      if (!order.orderDate) return false;
      const orderMonth = new Date(order.orderDate)
        .toLocaleString('default', { month: 'long' })
        .toLowerCase();
      return orderMonth === month;
    });
    this.currentPage = 1;
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredOrders.slice(start, end);
  }

  nextPage(): void {
    if ((this.currentPage * this.pageSize) < this.filteredOrders.length) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  changeMonth(month: string): void {
    this.selectedMonth = month;
    this.applyFilters();
  }

  get availableMonths(): string[] {
    const monthsSet = new Set(
      this.deliveredOrders.map((order: Order) => {
        if (!order.orderDate) return '';
        return new Date(order.orderDate).toLocaleString('default', { month: 'long' });
      })
    );
    return Array.from(monthsSet).filter(Boolean);
  }

  // Format order date for display (like in OrderHistory)
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
