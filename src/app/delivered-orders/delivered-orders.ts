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
  deliveredOrders: any[] = []; // ✅ original
  filteredOrders: any[] = [];  // ✅ filtered by month
  loading = true;
  error = '';

  selectedMonth = 'October'; // ✅ default month
  currentPage = 1;
  pageSize = 5;

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    const delivererId = this.auth.getId();
    if (delivererId) {
      this.api.get(`Deliverer/ViewDeliveredOrders/${delivererId}`).subscribe({
        next: (res: any) => {
          this.deliveredOrders = Array.isArray(res) ? res : []; // ✅ defensive fallback
          this.applyFilters(); // ✅ apply month filter
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load delivered orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "Deliverer not logged in";
      this.loading = false;
    }
  }

  applyFilters() {
    const monthIndex = new Date(`${this.selectedMonth} 1, 2025`).getMonth();
    this.filteredOrders = this.deliveredOrders.filter(order => {
      const date = new Date(order.deliveryDate);
      return date.getMonth() === monthIndex;
    });
    this.currentPage = 1;
  }

  get paginatedOrders() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  nextPage() {
    if ((this.currentPage * this.pageSize) < this.filteredOrders.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  changeMonth(month: string) {
    this.selectedMonth = month;
    this.applyFilters();
  }
}
