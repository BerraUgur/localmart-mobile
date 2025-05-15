import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RegisterRequest } from 'src/app/shared/services/registerRequest';
// import { FireserviceService } from 'src/app/fireservice.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  // constructor(private http:HttpClient, private router:Router, public fireService:FireserviceService) { }
  constructor(private http:HttpClient, private router:Router, public authService: AuthService, private alertController: AlertController) { }

  public firstName:any = '';
  public lastName:any = '';
  public userName:any = '';
  public phoneNumber:any = '';
  public email:any = '';
  public password:any = '';

  ngOnInit() {
  }

  async register() {
    console.log('this.userName => ', this.userName)
    if (this.userName == '' || this.email == '' || this.password == '' || this.firstName == '' || this.lastName == '' || this.phoneNumber == '') {
      const warningAlert = await this.alertController.create({
        header: 'Uyarı!',
        message: 'Lütfen tüm alanları doldurun.',
        buttons: ['Tamam']
      });
      await warningAlert.present();

    }else{
      const registerRequest: RegisterRequest = { email: this.email, password: this.password, firstName: this.firstName, lastName: this.lastName, phoneNumber: this.phoneNumber, username: this.userName };
      this.authService.Register(registerRequest).subscribe(
        async data => {
          this.router.navigate(['/login']);
        },
        async error => {
          if (error.status === 400) { // 409 Conflict status code
            const alert = await this.alertController.create({
              header: 'Uyarı!',
              message: 'Kullanıcı zaten kayıtlı, lütfen giriş yapınız.',
              buttons: ['Tamam']
            });
            await alert.present();
          } else {
            console.error('Login failed', error);
          }
        }
      );
    }
    
  }

}