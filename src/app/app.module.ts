import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterViewComponent } from './views/footer-view/footer-view.component';
import { HeaderViewComponent } from './views/header-view/header-view.component';
import { UserLoginViewComponent } from './views/user-views/user-login-view/user-login-view.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MerchantCreateViewComponent} from './views/merchant-views/merchant-create-view/merchant-create-view.component';
import {UserMerchantListViewComponent} from './views/user-views/user-merchant-list-view/user-merchant-list-view.component';
import { UserOrderHistoryViewComponent } from './views/user-views/user-order-history-view/user-order-history-view.component';
import {BasicViewGuard} from "./views/view-guards/basic-view-guard";
import { BasicNavViewComponent } from './views/nav-views/basic-nav-view/basic-nav-view.component';
import { UserProfileViewComponent } from './views/user-views/user-profile-view/user-profile-view.component';
import { UserCreateAccountView } from './views/user-views/user-create-account-view/user-create-account-view.component';
import { UserCreateOrderViewComponent } from './views/user-views/user-create-order-view/user-create-order-view.component';

//HttpClientModule required for http calls - httpClient

@NgModule({
  declarations: [
    AppComponent,
    FooterViewComponent,
    HeaderViewComponent,
    UserLoginViewComponent,
    UserLoginViewComponent,
    MerchantCreateViewComponent,
    UserMerchantListViewComponent,
    UserOrderHistoryViewComponent,
    BasicNavViewComponent,
    UserProfileViewComponent,
    UserCreateAccountView,
    UserCreateOrderViewComponent,
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
