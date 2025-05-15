import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { productDetailPage } from './product-detail.page';

const routes: Routes = [
  {
    path: '',
    component: productDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class productDetailPageRoutingModule {}
