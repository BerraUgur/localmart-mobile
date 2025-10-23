import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResetPasswordPage } from './reset-password.page';
import { ResetPasswordPageRoutingModule } from './reset-password-routing.module';

@NgModule({
  declarations: [ResetPasswordPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPasswordPageRoutingModule
  ],
  exports: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
