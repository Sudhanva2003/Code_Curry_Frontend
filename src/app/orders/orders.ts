
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  openOrders: any[] = [];
  pastOrders: any[] = [];
  filteredPastOrders: any[] = [];
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
    const userId = this.auth.getUser()?.userId;
    if (userId) {
      this.api.get(`Customer/ViewUserOrders/${userId}`).subscribe({
        next: (res: any) => {
          this.openOrders = res.openOrders || [];
          this.pastOrders = res.pastOrders || [];
          this.loading = false;
          this.getFilteredOrders();
        },
        error: (err) => {
          this.error = 'Failed to load orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "User not logged in";
      this.loading = false;
    }
  }

  getFilteredOrders() {
    const month = this.selectedMonth.toLowerCase();
    const filtered = this.pastOrders.filter(order => {
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
    const filtered = this.pastOrders.filter(order => {
      if (!order.orderDate) return false;
      const orderMonth = new Date(order.orderDate).toLocaleString('default', { month: 'long' }).toLowerCase();
      return orderMonth === month;
    });
    return Math.ceil(filtered.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
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

  changeMonth(month: string) {
    this.selectedMonth = month;
    this.currentPage = 1;
    this.getFilteredOrders();
  }
}
