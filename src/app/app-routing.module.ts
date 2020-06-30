import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {UserLoginViewComponent} from './views/login-views/user-login-view/user-login-view.component';
import {MerchantCreateViewComponent} from "./views/merchant-views/merchant-create-view/merchant-create-view.component";
import {ViewRoutes} from "./views/view-routes";
import {MerchantListViewComponent} from "./views/merchant-views/merchant-list-view/merchant-list-view.component";
import {BasicViewGuard} from "./views/view-guards/basic-view-guard";

// configure your SPA routing for AppComponent routing here
const routes: Routes = [
  //{path: 'poki', loadChildren: () => import('./features/poki/poki.module').then(m => m.PokiModule)},
  {path: ViewRoutes.LOGIN, component: UserLoginViewComponent},
  {path: ViewRoutes.MERCHANT_LIST, component: MerchantListViewComponent, canActivate: [BasicViewGuard]},
  {path: ViewRoutes.MERCHANT_CREATE, component: MerchantCreateViewComponent, canActivate: [BasicViewGuard]},
  {path: '', redirectTo: ViewRoutes.LOGIN, pathMatch: 'full'},
  {path: '**', component: UserLoginViewComponent },  // Wildcard route for a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true, enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
