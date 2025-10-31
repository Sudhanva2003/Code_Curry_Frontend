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

  currentMonth!: string;
  currentYear!: number;
  prevMonthLabel!: string;
  nextMonthLabel!: string;

  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit(): void {
    const delivererId = this.auth.getId();
    this.setCurrentMonthAndYear(new Date());

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

  setCurrentMonthAndYear(date: Date): void {
    this.currentMonth = date.toLocaleString('default', { month: 'long' });
    this.currentYear = date.getFullYear();
    this.updateMonthLabels();
  }

  updateMonthLabels(): void {
    const currentDate = new Date(`${this.currentMonth} 1, ${this.currentYear}`);
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);

    this.prevMonthLabel = prev.toLocaleString('default', { month: 'short' });
    this.nextMonthLabel = next.toLocaleString('default', { month: 'short' });
  }

  applyFilters(): void {
    this.filteredOrders = this.deliveredOrders.filter((order: Order) => {
      if (!order.orderDate) return false;
      const date = new Date(order.orderDate);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return month === this.currentMonth && year === this.currentYear;
    });

    this.totalPages = Math.ceil(this.filteredOrders.length / this.pageSize) || 1;
    this.currentPage = 1;
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredOrders.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextMonth(): void {
    const date = new Date(`${this.currentMonth} 1, ${this.currentYear}`);
    date.setMonth(date.getMonth() + 1);
    this.setCurrentMonthAndYear(date);
    this.applyFilters();
  }

  goToPrevMonth(): void {
    const date = new Date(`${this.currentMonth} 1, ${this.currentYear}`);
    date.setMonth(date.getMonth() - 1);
    this.setCurrentMonthAndYear(date);
    this.applyFilters();
  }

  canGoNext(): boolean {
    const current = new Date(`${this.currentMonth} 1, ${this.currentYear}`);
    const now = new Date();
    return current < new Date(now.getFullYear(), now.getMonth(), 1);
  }

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
