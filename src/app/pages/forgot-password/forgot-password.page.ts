import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MailService } from 'src/app/services/mail.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  isValidEmail(email: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }
  email = '';
  isSubmitting = false;

  constructor(
    private mailService: MailService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private logger: LoggerService
  ) {}

  async sendResetRequest() {
    this.isSubmitting = true;

    this.authService.requestPasswordReset(this.email).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: 'Info',
          message: 'A password reset link has been sent.',
          buttons: ['OK']
        });
        await alert.present();
        this.email = '';
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        const alert = await this.alertController.create({
          header: 'Info',
          message: 'A password reset link has been sent.',
          buttons: ['OK']
        });
        await alert.present();
        this.isSubmitting = false;
        this.logger.logError('Error requesting password reset:', err);
        this.router.navigate(['/login']);
      }
    });
  }
}
