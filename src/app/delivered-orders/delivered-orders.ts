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

  monthNames = [
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

          this.deliveredOrders = Array.isArray(res)
            ? res.filter((order: Order) => validStatuses.includes(order.status))
            : [];

          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading delivered orders:', err);
          this.error = 'Failed to load delivered orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "Deliverer not logged in";
      this.loading = false;
    }
  }

  applyFilters(): void {
    const monthIndex = this.monthNames.indexOf(this.selectedMonth);
    this.filteredOrders = this.deliveredOrders.filter((order: Order) => {
      const date = new Date(order.orderDate);
      return date.getMonth() === monthIndex;
    });
    this.currentPage = 1;
  }

  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
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
    return [...new Set(this.deliveredOrders.map((order: Order) => {
      const date = new Date(order.orderDate);
      return this.monthNames[date.getMonth()];
    }))];
  }
}
