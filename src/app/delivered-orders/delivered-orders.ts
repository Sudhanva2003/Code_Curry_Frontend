import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'delivered-orders',
  standalone: false,
  templateUrl: './delivered-orders.html',
  styleUrls: ['./delivered-orders.css']
})
export class DeliveredOrders implements OnInit {
  deliveredOrders: any[] = [];
  filteredOrders: any[] = [];
  loading = true;
  error = '';

  currentDate = new Date();
  today = new Date();
  pageSize = 5;
  currentPage = 1;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    const delivererId = this.auth.getId();
    if (delivererId) {
      this.api.get(`Deliverer/ViewDeliveredOrders/${delivererId}`).subscribe({
        next: (res: any) => {
          this.deliveredOrders = Array.isArray(res) ? res : [];
          this.applyFilters();
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load delivered orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "Deliverer not logged in";
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
    this.applyFilters();
  }

  goToNextMonth() {
    if (this.canGoNext()) {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.currentPage = 1;
      this.applyFilters();
    }
  }

  applyFilters() {
    const month = this.currentDate.getMonth();
    const year = this.currentDate.getFullYear();
    this.filteredOrders = this.deliveredOrders.filter(order => {
      const date = new Date(order.orderDate);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }

  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredOrders.length && this.canGoNext()) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
