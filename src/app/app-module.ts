import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Register } from './register/register';
import { RegisterCustomer } from './register-customer/register-customer';
import { RegisterRestaurant } from './register-restaurant/register-restaurant';
import { RestaurantView } from './restaurant-view/restaurant-view';
import { CustomerView } from './customer-view/customer-view';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpenOrders } from './open-orders/open-orders';
import { Menu } from './menu/menu';
import { OrderHistory } from './order-history/order-history';
import { Settings } from './settings/settings';
import { Home } from './home/home';
import { Cart } from './cart/cart';
import { Orders } from './orders/orders';
import { CustomerSettings } from './customer-settings/customer-settings';
import { provideHttpClient } from '@angular/common/http';
import { RestaurantMenu } from './restaurant-menu/restaurant-menu';
import { RegisterDeliverer } from './register-deliverer/register-deliverer';
import { LiveOrders } from './live-orders/live-orders';
import { DelivererView } from './deliverer-view/deliverer-view';
import { DeliveredOrders } from './delivered-orders/delivered-orders';
import { DelivererSettings } from './deliverer-settings/deliverer-settings';
import { Delivery } from './delivery/delivery';
import { AdminView } from './admin-view/admin-view';
import { OpenTickets } from './open-tickets/open-tickets';
import { MyTickets } from './my-tickets/my-tickets';
import { ResolvedTickets } from './resolved-tickets/resolved-tickets';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    RegisterCustomer,
    RegisterRestaurant,
    RestaurantView,
    CustomerView,
    Header,
    Footer,
    OpenOrders,
    Menu,
    OrderHistory,
    Settings,
    Home,
    Cart,
    Orders,
    CustomerSettings,
    RestaurantMenu,
    RegisterDeliverer,
    LiveOrders,
    DelivererView,
    DeliveredOrders,
    DelivererSettings,
    Delivery,
    AdminView,
    OpenTickets,
    MyTickets,
    ResolvedTickets
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
