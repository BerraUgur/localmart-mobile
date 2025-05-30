import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductUpdatePage } from './product-update.page';
import { ProductUpdatePageRoutingModule } from './product-update-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProductUpdatePageRoutingModule
  ],
  declarations: [ProductUpdatePage]
})
export class ProductUpdatePageModule {}
