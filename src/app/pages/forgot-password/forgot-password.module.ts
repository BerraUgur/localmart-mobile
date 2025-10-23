import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForgotPasswordPage } from './forgot-password.page';
import { ForgotPasswordPageRoutingModule } from './forgot-password-routing.module';

@NgModule({
  declarations: [ForgotPasswordPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgotPasswordPageRoutingModule
  ],
  exports: [ForgotPasswordPage]
})
export class ForgotPasswordPageModule {}
