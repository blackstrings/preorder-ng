import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterViewComponent } from './views/footer-view/footer-view.component';
import { HeaderViewComponent } from './views/header-view/header-view.component';
import { UserLoginViewComponent } from './views/login-views/user-login-view/user-login-view.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MerchantCreateViewComponent} from './views/merchant-views/merchant-create-view/merchant-create-view.component';
import {MerchantListViewComponent} from './views/merchant-views/merchant-list-view/merchant-list-view.component';
import { OrderHistoryViewComponent } from './views/customer-views/order-history-view/order-history-view.component';
import {BasicViewGuard} from "./views/view-guards/basic-view-guard";

//HttpClientModule required for http calls - httpClient

@NgModule({
  declarations: [
    AppComponent,
    FooterViewComponent,
    HeaderViewComponent,
    UserLoginViewComponent,
    UserLoginViewComponent,
    MerchantCreateViewComponent,
    MerchantListViewComponent,
    OrderHistoryViewComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [BasicViewGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
