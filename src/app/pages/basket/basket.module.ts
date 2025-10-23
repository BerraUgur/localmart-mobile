import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BasketPage } from './basket.page';
import { BasketPageRoutingModule } from './basket-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BasketPageRoutingModule
  ],
  declarations: [BasketPage]
})
export class BasketPageModule { }
