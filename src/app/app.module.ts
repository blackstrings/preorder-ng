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
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import { ProductAddModalViewComponent } from './views/common-views/product-add-view/product-add-modal-view.component';
import { FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';

// https://fontawesome.com/icons?d=gallery&q=shop&m=free
// only use these for testing till you find the right icon
// best to import specific icons as you need - turn off on commit
// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
// individual icons
import { faBell as farBell, faSlidersH } from '@fortawesome/free-solid-svg-icons';
import { faBell as fasBell } from '@fortawesome/free-regular-svg-icons';
import { faFacebookSquare, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

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
    ProductAddModalViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModalModule,
    FontAwesomeModule
  ],
  providers: [BasicViewGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary){
    //font awesome libraries as whole - only for testing, so don't commit with it on
    // library.addIconPacks(fas, far);
    // individual icons - better approach - leave on for commit
    library.addIcons(
      faShoppingCart, farBell, fasBell, faFacebookSquare, faTwitterSquare, faSlidersH
    );
  }
}
