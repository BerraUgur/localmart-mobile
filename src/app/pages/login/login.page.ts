import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequest } from 'src/app/models/loginRequest';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    public authService: AuthService,
    private alertController: AlertController,
    private logger: LoggerService
  ) { }

  ngOnInit(): void { }

  async login(): Promise<void> {
    const loginRequest: LoginRequest = { email: this.email, password: this.password };
    this.authService.login(loginRequest).subscribe({
      next: data => {
        localStorage.setItem('token', data.accessToken ?? "");
        this.authService.setUserStats();
        this.router.navigate(['/']).then(() => window.location.reload());
      },
      error: async (err) => {
        this.logger.logError('Login failed', err);
        const warningAlert = await this.alertController.create({
          header: 'Warning!',
          message: 'Invalid username or password.',
          buttons: ['OK']
        });
        await warningAlert.present();
      }
    });
  }
}
