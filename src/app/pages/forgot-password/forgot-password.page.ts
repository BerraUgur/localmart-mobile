import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MailService } from 'src/app/services/mail.service';
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
    private router: Router,
    private alertController: AlertController,
    private logger: LoggerService
  ) {}

  async sendResetRequest() {
    this.isSubmitting = true;
    this.logger.info('Password reset requested', { email: this.email });
    const mail = {
      to: this.email,
      subject: 'Password Reset Request',
      body: `Click the link below to reset your password:\nhttp://localhost:4200/reset-password?email=${this.email}`
    };
    this.mailService.sendMail(mail).subscribe({
      next: async () => {
        const alert = await this.alertController.create({
          header: 'Info',
          message: 'Password reset request has been sent to your email address.',
          buttons: ['OK']
        });
        await alert.present();
        this.email = '';
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: async () => {
        const alert = await this.alertController.create({
          header: 'Info',
          message: 'Password reset request has been sent to your email address.',
          buttons: ['OK']
        });
        await alert.present();
        this.email = '';
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      }
    });
  }
}
