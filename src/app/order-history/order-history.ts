import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'order-history',
  standalone: false,
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistory implements OnInit {
  pastOrders: any[] = [];
  filteredPastOrders: any[] = [];
  currentPage = 1;
  pageSize = 5;
  loading = true;
  error = '';

  currentDate = new Date();
  today = new Date();
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    const restId = this.auth.getId();
    if (restId) {
      this.api.get(`Restaurant/ViewRestaurantPastOrders/${restId}`).subscribe({
        next: (res: any) => {
          this.pastOrders = res || [];
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
    next.setMonth(next.getMonth() + 1);
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
}
