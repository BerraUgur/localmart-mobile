import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LoginRequest } from 'src/app/shared/services/loginRequest';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private http: HttpClient, private router: Router, public authService: AuthService, private alertController: AlertController) { }

  email: string = '';
  password: string = '';

  ngOnInit() {
  }

  async login() {
    const loginRequest: LoginRequest = { email: this.email, password: this.password };
    this.authService.login(loginRequest).subscribe(
      data => {
        localStorage.setItem('token', data.accessToken ?? "");
        this.authService.setUserStats();
        this.router.navigate(['/']).then(c => window.location.reload())
      },
      async error => {
        const warningAlert = await this.alertController.create({
          header: 'Uyarı!',
          message: 'Kullanıcı adı veya şifre hatalı.',
          buttons: ['Tamam']
        });
        await warningAlert.present();
      }
    );
  }
}
