// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../api-service';
// import { AuthGuard } from '../auth.guard';

// @Component({
//   selector: 'open-orders',
//   standalone: false,
//   templateUrl: './open-orders.html',
//   styleUrls: ['./open-orders.css']
// })
// export class OpenOrders implements OnInit {
//   orders: any[] = [];
//   loading = true;
//   error = '';

//   constructor(private api: ApiService, private auth: AuthGuard) {}

//   ngOnInit() {
//     this.loadOrders();
//   }

//   // loadOrders() {
//   //   this.loading = true;
//   //   const restId = this.auth.getId(); // restaurant ID
//   //   if (restId) {
//   //     this.api.get(`Restaurant/ViewRestaurantOpenOrders/${restId}`).subscribe({
//   //       next: (res: any) => {
//   //         console.log("API Response:", res);
//   //         this.orders = res || [];
//   //         this.loading = false;
//   //       },
//   //       error: (err) => {
//   //         console.error("API Error:", err);
//   //         this.error = 'Failed to load orders';
//   //         this.loading = false;
//   //       }
//   //     });
//   //   } else {
//   //     this.error = "Restaurant not logged in";
//   //     this.loading = false;
//   //   }
//   // }

//   loadOrders() {
//   this.loading = true;
//   const restId = this.auth.getId(); // restaurant ID
//   if (restId) {
//     this.api.get(`Restaurant/ViewRestaurantOpenOrders/${restId}`).subscribe({
//       next: (res: any[]) => {
//         console.log("API Response:", res);
//         this.orders = (res || []).filter(order =>
//   order.status === 'Paid' ||
//   order.status === 'CancelledByCustomer' ||
//   order.status === 'CancelledByRest'
// );

//         this.loading = false;
//       },
//       error: (err) => {
//         console.error("API Error:", err);
//         this.error = 'Failed to load orders';
//         this.loading = false;
//       }
//     });
//   } else {
//     this.error = "Restaurant not logged in";
//     this.loading = false;
//   }
// }

//   markPrepared(orderId: number) {
//     const confirmed = confirm("Mark this order as prepared?");
//     if (confirmed) {
//       this.api.put(`Restaurant/Prepared/${orderId}`, {}).subscribe({
//         next: (res) => {
//           alert('Order marked as prepared!');
//           // Refresh the orders list
//           this.loadOrders();
//         },
//         error: (err) => {
//           console.error("Error marking prepared:", err);
//           alert('Failed to mark order as prepared.');
//         }
//       });

//     }

//   }
//  markNoted(orderId: number) {
//   const order = this.orders.find(o => o.orderId === orderId);
//   if (!order || order.status !== 'CancelledByRest') {
//     alert('This order was not cancelled by the restaurant.');
//     return;
//   }

//   const confirmed = confirm("Move this cancelled order to history?");
//   if (confirmed) {
//     this.api.put(`Restaurant/Noted/${orderId}`, {}).subscribe({
//       next: () => {
//         alert('Order marked as noted.');
//         this.loadOrders();
//       },
//       error: (err) => {
//         console.error("Error marking noted:", err);
//         alert(err?.error || 'Failed to mark order as noted.');
//       }
//     });
//   }
// }


// cancelOrder(orderId: number) {
//   const confirmed = confirm("Are you sure you want to cancel this order?");
//   if (confirmed) {
//     this.api.put(`Customer/CancelOrder/${orderId}`, {}).subscribe({
//       next: () => {
//         alert('Order cancelled successfully.');
//         this.loadOrders();
//       },
//       error: (err) => {
//         console.error("Error cancelling order:", err);
//         alert('Failed to cancel order.');
//       }
//     });
//   }
// }
// }


// import { Component, OnInit } from '@angular/core';
// import { ApiService } from '../api-service';
// import { AuthGuard } from '../auth.guard';

// interface OrderItem {
//   foodName: string;
//   quantity: number;
//   foodImageUrl: string;
// }

// interface Order {
//   orderId: number;
//   orderDate: string;
//   status: string;
//   totalAmount: number;
//   items: OrderItem[];
// }

// @Component({
//   selector: 'open-orders',
//   standalone: false,
//   templateUrl: './open-orders.html',
//   styleUrls: ['./open-orders.css']
// })
// export class OpenOrders implements OnInit {
//   orders: Order[] = [];
//   pastOrders: Order[] = [];
//   loading = true;
//   error = '';

//   constructor(private api: ApiService, private auth: AuthGuard) {}

//   ngOnInit(): void {
//     this.loadOrders();
//   }

//   loadOrders(): void {
//     this.loading = true;
//     const restId = this.auth.getId();

//     if (restId) {
//       this.api.get(`Restaurant/ViewRestaurantOpenOrders/${restId}`).subscribe({
//         next: (res: Order[]) => {
//           this.orders = (res || []).filter((order: Order) =>
//             order.status === 'Paid' ||
//             order.status === 'CancelledByCustomer' ||
//             order.status === 'CancelledByDeliverer'
//           );
//           this.loading = false;
//         },
//         error: (err) => {
//           console.error("API Error:", err);
//           this.error = 'Failed to load orders';
//           this.loading = false;
//         }
//       });
//     } else {
//       this.error = "Restaurant not logged in";
//       this.loading = false;
//     }
//   }

//   markPrepared(orderId: number): void {
//     const confirmed = confirm("Mark this order as prepared?");
//     if (!confirmed) return;

//     this.api.put(`Restaurant/Prepared/${orderId}`, {}).subscribe({
//       next: () => {
//         alert('Order marked as prepared!');
//         this.loadOrders();
//       },
//       error: (err) => {
//         console.error("Error marking prepared:", err);
//         alert('Failed to mark order as prepared.');
//       }
//     });
//   }

//   cancelOrder(orderId: number): void {
//     const confirmed = confirm("Are you sure you want to cancel this order?");
//     if (!confirmed) return;

//     this.api.put(`Restaurant/CancelOrder/${orderId}`, {}).subscribe({
//       next: () => {
//         alert('Order cancelled successfully.');
//         this.loadOrders();
//       },
//       error: (err) => {
//         console.error("Error cancelling order:", err);
//         alert('Failed to cancel order.');
//       }
//     });
//   }

//   markNoted(orderId: number): void {
//     const order = this.orders.find((o: Order) => o.orderId === orderId);
//     if (!order || (
//       order.status !== 'CancelledByCustomer' &&
//       order.status !== 'CancelledByDeliverer' &&
//       order.status !== 'CancelledByRest'
//     )) {
//       alert('This order is not eligible for noting.');
//       return;
//     }

//     const confirmed = confirm("Move this cancelled order to history?");
//     if (!confirmed) return;

//     this.api.put(`Restaurant/Noted/${orderId}`, {}).subscribe({
//       next: (res: any) => {
//         alert(typeof res === 'string' ? res : 'Order marked as cancelled.');

//         // ✅ Remove from openOrders
//         this.orders = this.orders.filter((o: Order) => o.orderId !== orderId);

//         // ✅ Push into pastOrders manually
//         const updatedOrder: Order = {
//           orderId: res.orderId,
//           orderDate: res.orderDate,
//           status: res.status,
//           totalAmount: res.totalAmount,
//           items: res.items.map((item: any) => ({
//             foodName: item.name,
//             quantity: item.quantity,
//             foodImageUrl: item.foodImageUrl
//           }))
//         };

//         this.pastOrders.push(updatedOrder);
//       },
//       error: (err) => {
//         console.error("Error marking noted:", err);
//         alert(err?.error || 'Failed to mark order as cancelled.');
//       }
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api-service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'open-orders',
  standalone: false,
  templateUrl: './open-orders.html',
  styleUrls: ['./open-orders.css']
})
export class OpenOrders implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';

  constructor(private api: ApiService, private auth: AuthGuard) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    const restId = this.auth.getId(); // restaurant ID
    if (restId) {
      this.api.get(`Restaurant/ViewRestaurantOpenOrders/${restId}`).subscribe({
        next: (res: any[]) => {
          console.log("API Response:", res);
         this.orders = (res || []).filter(order =>
  order.status === 'Paid'|| 
  order.status=='Assigned'
);
         this.loading = false;
        },
        error: (err) => {
          console.error("API Error:", err);
          this.error = 'Failed to load orders';
          this.loading = false;
        }
      });
    } else {
      this.error = "Restaurant not logged in";
      this.loading = false;
    }
  }

  markPrepared(orderId: number) {
    const confirmed = confirm("Mark this order as prepared?");
    if (confirmed) {
      this.api.put(`Restaurant/Prepared/${orderId}`, {}).subscribe({
        next: () => {
          alert('Order marked as prepared!');
          this.loadOrders();
        },
        error: (err) => {
          console.error("Error marking prepared:", err);
          alert('Failed to mark order as prepared.');
        }
      });
    }
  }

  cancelOrder(orderId: number) {
    const confirmed = confirm("Are you sure you want to cancel this order?");
    if (confirmed) {
      this.api.put(`Restaurant/CancelOrder/${orderId}`, {}).subscribe({
        next: () => {
          alert('Order cancelled successfully.');
          this.loadOrders();
        },
        error: (err) => {
          console.error("Error cancelling order:", err);
          alert('Failed to cancel order.');
        }
      });
    }
  }
}
