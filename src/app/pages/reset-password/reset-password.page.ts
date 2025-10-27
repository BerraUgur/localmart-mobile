import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  newPassword = '';
  confirmPassword = '';
  email = '';
  token = '';
  isSubmitting = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private logger: LoggerService
  ) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['token'] || '';
    });
  }

  async resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: 'Error!',
        message: 'Passwords do not match.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    this.isSubmitting = true;
    this.authService.resetPassword(this.email, this.token, this.newPassword).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: 'Success!',
          message: 'Your password has been reset. You can now log in with your new password.',
          buttons: ['OK']
        });
        await alert.present();
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        this.logger.logError('Password reset failed', err);
        const alert = await this.alertController.create({
          header: 'Error!',
          message: 'Password reset failed. Please try again or request a new link.',
          buttons: ['OK']
        });
        await alert.present();
        this.isSubmitting = false;
      }
    });
  }
}
