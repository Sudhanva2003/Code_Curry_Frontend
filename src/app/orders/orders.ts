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
  loading = true;
  error = '';

  constructor(private api: ApiService, private auth: AuthGuard) {}

  ngOnInit() {
    console.log("hi");
    const userId = this.auth.getUser()?.userId;
    if (userId) {
      console.log("hi");
      this.api.get(`Users/ViewUserOrders/${userId}`).subscribe({
        next: (res: any) => {
          console.log("API Response:", res); // should log JSON correctly
          this.openOrders = res.openOrders || [];
          this.pastOrders = res.pastOrders || [];
          this.loading = false;
        },
        error: (err) => {
          console.error("API Error:", err);
          this.error = 'Failed to load orders';
          this.loading = false;
        }
      });
    } else {
      console.log("noway");
      this.error = "User not logged in";
      this.loading = false;
    }
  }
}
