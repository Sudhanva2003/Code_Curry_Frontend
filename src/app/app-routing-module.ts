import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { RegisterUser } from './register-user/register-user';
import { RegisterRestaurant } from './register-restaurant/register-restaurant';
import { RestaurantView } from './restaurant-view/restaurant-view';
import { UserView } from './user-view/user-view';
import { Menu } from './menu/menu';
import { OrderHistory } from './order-history/order-history';
import { OpenOrders } from './open-orders/open-orders';
import { Settings } from './settings/settings';
import { UserSettings } from './user-settings/user-settings';
import { Cart } from './cart/cart';
import { Home } from './home/home';
import { Orders } from './orders/orders';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'register-user', component: RegisterUser },
  { path: 'register-restaurant', component: RegisterRestaurant },

  {
  path: 'user',
  component: UserView,
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'cart', component: Cart },
    { path: 'orders', component: Orders },
    { path: 'user-settings', component: UserSettings }
  ]
},

  {
    path: 'restaurant',
    component: RestaurantView, // parent component
    children: [
      { path: '', redirectTo: 'open-orders', pathMatch: 'full' },
      { path: 'open-orders', component: OpenOrders },
      { path: 'menu', component: Menu },
      { path: 'order-history', component: OrderHistory },
      { path: 'settings', component: Settings }
    ]
  },

  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
