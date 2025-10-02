import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './login/login';
import { Register } from './register/register';
import { RegisterUser } from './register-user/register-user';
import { RegisterRestaurant } from './register-restaurant/register-restaurant';
import { RestaurantView } from './restaurant-view/restaurant-view';
import { UserView } from './user-view/user-view';
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
import { UserSettings } from './user-settings/user-settings';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    RegisterUser,
    RegisterRestaurant,
    RestaurantView,
    UserView,
    Header,
    Footer,
    OpenOrders,
    Menu,
    OrderHistory,
    Settings,
    Home,
    Cart,
    Orders,
    UserSettings
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
