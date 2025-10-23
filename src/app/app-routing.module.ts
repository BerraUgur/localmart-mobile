import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then(m => m.productsPageModule)
  },
  {
    path: 'product-detail/:id',
    loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.productDetailPageModule)
  },
  {
    path: 'product-add',
    loadChildren: () => import('./pages/product-add/product-add.module').then(m => m.ProductAddPageModule)
  },
  {
    path: 'product-update/:id',
    loadChildren: () => import('./pages/product-update/product-update.module').then(m => m.ProductUpdatePageModule)
  },
  {
    path: 'user-edit/:id',
    loadChildren: () => import('./pages/user-edit/user-edit.module').then(m => m.UserEditPageModule)
  },
  {
    path: 'user-list',
    loadChildren: () => import('./pages/user-list/user-list.module').then(m => m.UserListPageModule)
  },
  {
    path: 'basket',
    loadChildren: () => import('./pages/basket/basket.module').then(m => m.BasketPageModule)
  },
  {
    path: 'my-orders',
    loadChildren: () => import('./pages/my-orders/my-orders.module').then(m => m.MyOrdersPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then(m => m.ResetPasswordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
