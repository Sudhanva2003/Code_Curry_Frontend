import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { RegisterCustomer } from './register-customer/register-customer';
import { RegisterRestaurant } from './register-restaurant/register-restaurant';
import { RegisterDeliverer } from './register-deliverer/register-deliverer';
import { RestaurantView } from './restaurant-view/restaurant-view';
import { CustomerView } from './customer-view/customer-view';
import { Menu } from './menu/menu';
import { OrderHistory } from './order-history/order-history';
import { OpenOrders } from './open-orders/open-orders';
import { Settings } from './settings/settings';
import { CustomerSettings } from './customer-settings/customer-settings';
import { Cart } from './cart/cart';
import { Home } from './home/home';
import { Orders } from './orders/orders';
import { RestaurantMenu } from './restaurant-menu/restaurant-menu';
import { DelivererView } from './deliverer-view/deliverer-view';
import { LiveOrders } from './live-orders/live-orders';
import { Delivery } from './delivery/delivery';
import { DeliveredOrders } from './delivered-orders/delivered-orders';
import { DelivererSettings } from './deliverer-settings/deliverer-settings';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register-customer', component: RegisterCustomer },
  { path: 'register-restaurant', component: RegisterRestaurant },
  { path: 'register-deliverer', component: RegisterDeliverer },
  {
    path: 'customer',
    component: CustomerView,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'cart', component: Cart },
      { path: 'orders', component: Orders },
      { path: 'customer-settings', component: CustomerSettings },
      { path: 'restaurant/:id', component: RestaurantMenu }
    ]
  },
  {
    path: 'restaurant',
    component: RestaurantView,
    children: [
      { path: '', redirectTo: 'open-orders', pathMatch: 'full' },
      { path: 'open-orders', component: OpenOrders },
      { path: 'menu', component: Menu },
      { path: 'order-history', component: OrderHistory },
      { path: 'settings', component: Settings }
    ]
  },
  {
    path: 'deliverer',
    component: DelivererView,
    children: [
      { path: '', redirectTo: 'live-orders', pathMatch: 'full' },
      { path: 'live-orders', component: LiveOrders },
      { path: 'delivery', component: Delivery },
      { path: 'delivered-orders', component: DeliveredOrders },
      { path: 'deliverer-settings', component: DelivererSettings }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
