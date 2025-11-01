import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';
import { RegisterRequest } from 'src/app/models/registerRequest';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private http: HttpClient, private router: Router, public authService: AuthService, private alertController: AlertController, private logger: LoggerService) { }

  public firstName: any = '';
  public lastName: any = '';
  public userName: any = '';
  public phoneNumber: any = '';
  public email: any = '';
  public password: any = '';

  ngOnInit() {
  }

  async register() {
    if (this.userName === '' || this.email === '' || this.password === '' || this.firstName === '' || this.lastName === '' || this.phoneNumber === '') {
      const warningAlert = await this.alertController.create({
        header: 'Warning!',
        message: 'Please fill in all fields.',
        buttons: ['OK']
      });
      await warningAlert.present();
    } else {
      const registerRequest: RegisterRequest = { email: this.email, password: this.password, firstName: this.firstName, lastName: this.lastName, phoneNumber: this.phoneNumber.toString(), username: this.userName };
      this.authService.register(registerRequest).subscribe(
        async () => {
          this.router.navigate(['/login']);
        },
        async error => {
          if (error.status === 400) {
            const alert = await this.alertController.create({
              header: 'Warning!',
              message: 'User already registered, please login.',
              buttons: ['OK']
            });
            await alert.present();
          } else {
            this.logger.logError('Registration failed', error);
          }
        }
      );
    }
  }
}