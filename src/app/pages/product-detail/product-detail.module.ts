import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { productDetailPage } from './product-detail.page';
import { productDetailPageRoutingModule } from './product-detail-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    productDetailPageRoutingModule
  ],
  declarations: [productDetailPage]
})
export class productDetailPageModule { }
