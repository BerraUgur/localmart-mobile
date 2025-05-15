import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { productDetailPageRoutingModule } from './product-detail-routing.module';
import { productDetailPage } from './product-detail.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    productDetailPageRoutingModule
  ],
  declarations: [productDetailPage]
})
export class productDetailPageModule {}
