import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {UserLoginViewComponent} from './views/user-views/user-login-view/user-login-view.component';
import {MerchantCreateViewComponent} from "./views/merchant-views/merchant-create-view/merchant-create-view.component";
import {ViewRoutes} from "./views/view-routes";
import {MerchantListViewComponent} from "./views/merchant-views/merchant-list-view/merchant-list-view.component";
import {BasicViewGuard} from "./views/view-guards/basic-view-guard";
import {UserProfileViewComponent} from "./views/user-views/user-profile-view/user-profile-view.component";
import {UserCreateAccountView} from "./views/user-views/user-create-account-view/user-create-account-view.component";

// configure your SPA routing for AppComponent routing here
const routes: Routes = [
  //{path: 'poki', loadChildren: () => import('./features/poki/poki.module').then(m => m.PokiModule)},
  {path: ViewRoutes.LOGIN, component: UserLoginViewComponent},
  {path: ViewRoutes.USER_PROFILE, component: UserProfileViewComponent, canActivate: [BasicViewGuard]},
  {path: ViewRoutes.USER_CREATE, component: UserCreateAccountView},
  {path: ViewRoutes.MERCHANT_LIST, component: MerchantListViewComponent, canActivate: [BasicViewGuard]},
  {path: ViewRoutes.MERCHANT_CREATE, component: MerchantCreateViewComponent, canActivate: [BasicViewGuard]},
  {path: '**', component: UserLoginViewComponent },  // Wildcard route for a 404 page
  //{path: '', redirectTo: ViewRoutes.LOGIN, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true, enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
