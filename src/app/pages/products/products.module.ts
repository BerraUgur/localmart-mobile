import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { productsPage } from './products.page';
import { productsPageRoutingModule } from './products-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    productsPageRoutingModule
  ],
  declarations: [productsPage]
})
export class productsPageModule { }
