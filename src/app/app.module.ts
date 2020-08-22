import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FooterViewComponent} from './views/footer-view/footer-view.component';
import {HeaderViewComponent} from './views/header-view/header-view.component';
import {UserLoginViewComponent} from './views/user-views/user-login-view/user-login-view.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MerchantCreateViewComponent} from './views/merchant-views/merchant-create-view/merchant-create-view.component';
import {UserMerchantListViewComponent} from './views/user-views/user-merchant-list-view/user-merchant-list-view.component';
import {UserOrderHistoryViewComponent } from './views/user-views/user-order-history-view/user-order-history-view.component';
import {BasicViewGuard} from "./views/view-guards/basic-view-guard";
import {BasicNavViewComponent} from './views/nav-views/basic-nav-view/basic-nav-view.component';
import {UserProfileViewComponent} from './views/user-views/user-profile-view/user-profile-view.component';
import {UserCreateAccountView} from './views/user-views/user-create-account-view/user-create-account-view.component';
import {UserCreateOrderViewComponent} from './views/user-views/user-create-order-view/user-create-order-view.component';
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {ProductAddModalViewComponent} from './views/common-views/modals/product-add-view/product-add-modal-view.component';
import {FontAwesomeModule, FaIconLibrary} from '@fortawesome/angular-fontawesome';
import {YesNoModalViewComponent} from './views/common-views/modals/yes-no-modal-view/yes-no-modal-view.component';
import {AppServicesOrderInitializer} from "./services/app-services-order-initializer/app-services-order-initializer.service";

// https://fontawesome.com/icons?d=gallery&q=shop&m=free
// only use these for testing till you find the right icon
// best to import specific icons as you need - turn off on commit
// import { fas } from '@fortawesome/free-solid-svg-icons';
// import { far } from '@fortawesome/free-regular-svg-icons';
// individual icons
import {faBell as farBell, faSlidersH} from '@fortawesome/free-solid-svg-icons';
import {faBell as fasBell } from '@fortawesome/free-regular-svg-icons';
import {faFacebookSquare, faTwitterSquare} from '@fortawesome/free-brands-svg-icons';
import {faShoppingCart, faTimes, faPlus, faMinus, faSearch, faCheck, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import { UserReviewOrderViewComponent } from './views/user-views/user-review-order-view/user-review-order-view.component';
import {OkayModalViewComponent} from "./views/common-views/modals/okay-modal-view/okay-modal-view.component";
import { TermsAndConditionViewComponent } from './views/common-views/forms/terms-and-condition-view/terms-and-condition-view.component';
import { MerchantHowItWorksViewComponent } from './views/merchant-views/merchant-how-it-works-view/merchant-how-it-works-view.component';
import { MerchantAddProductViewComponent } from './views/merchant-views/merchant-add-product-view/merchant-add-product-view.component';
import { UserOrderCheckoutViewComponent } from './views/user-views/user-order-checkout-view/user-order-checkout-view.component';
import { MerchantHomeViewComponent } from './views/merchant-views/merchant-home-view/merchant-home-view.component';
import {MerchantStoreEditorComponent} from "./views/merchant-views/merchant-store-editor/merchant-store-editor.component";
import { LoadingViewComponent } from './views/common-views/loading-view/loading-view.component';

//HttpClientModule required for http calls - httpClient

// ensures some services and their subscriptions are up before any components are
export function appCustomInit(cartService: AppServicesOrderInitializer) {
  return () => {}
}

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
    ProductAddModalViewComponent,
    YesNoModalViewComponent,
    OkayModalViewComponent,
    UserReviewOrderViewComponent,
    TermsAndConditionViewComponent,
    MerchantHowItWorksViewComponent,
    MerchantAddProductViewComponent,
    UserOrderCheckoutViewComponent,
    MerchantHomeViewComponent,
    MerchantStoreEditorComponent,
    LoadingViewComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModalModule,
    FontAwesomeModule
  ],
  providers: [
    BasicViewGuard,
    [AppServicesOrderInitializer,
      {
        provide: APP_INITIALIZER,
        useFactory: appCustomInit,
        multi: true,
        deps: [AppServicesOrderInitializer]
      }],
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary){
    //font awesome libraries as whole - only for testing, so don't commit with it on
    // library.addIconPacks(fas, far);
    // individual icons - better approach - leave on for commit
    library.addIcons(
      faShoppingCart, farBell, fasBell, faFacebookSquare, faTwitterSquare, faSlidersH, faTimes, faPlus, faMinus,
      faSearch, faCheck, faExclamationCircle
    );
  }
}
