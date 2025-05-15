import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { User } from 'src/app/shared/services/comment';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  // users: any = [
  //   { id: 1, firstName: 'Ahmet', lastName: 'Yılmaz', username: 'ahmety', email: 'ahmet@example.com', phoneNumber: '05331234567', role: 1 },
  //   { id: 2, firstName: 'Ayşe', lastName: 'Demir', username: 'ayse_d', email: 'ayse@example.com', phoneNumber: '05339876543', role: 2 },
  //   { id: 3, firstName: 'Mehmet', lastName: 'Kaya', username: 'mkaya', email: 'mehmet@example.com', phoneNumber: '05551234567', role: 3 },
  //   { id: 4, firstName: 'Elif', lastName: 'Çelik', username: 'elifc', email: 'elif@example.com', phoneNumber: '05441234567', role: 1 },
  //   { id: 5, firstName: 'Mustafa', lastName: 'Öztürk', username: 'mustafao', email: 'mustafa@example.com', phoneNumber: '05321234567', role: 2 },
  //   { id: 6, firstName: 'Zeynep', lastName: 'Koç', username: 'zeynepk', email: 'zeynep@example.com', phoneNumber: '05001234567', role: 1 },
  //   { id: 7, firstName: 'Fatma', lastName: 'Yıldız', username: 'fatmay', email: 'fatma@example.com', phoneNumber: '05231234567', role: 3 },
  //   { id: 8, firstName: 'Burak', lastName: 'Aydın', username: 'buraka', email: 'burak@example.com', phoneNumber: '05361234567', role: 2 },
  //   { id: 9, firstName: 'Hülya', lastName: 'Erdoğan', username: 'hulyae', email: 'hulya@example.com', phoneNumber: '05431234567', role: 1 },
  //   { id: 10, firstName: 'Emre', lastName: 'Şahin', username: 'emres', email: 'emre@example.com', phoneNumber: '05391234567', role: 2 }
  // ];
  // user = {
  //   firstName: 'Ahmet',
  //   lastName: 'Yılmaz',
  //   username: 'ahmety',
  //   email: 'ahmet@example.com',
  //   phoneNumber: '05331234567',
  //   role: 1,
  // };
  user: any = {};

  userId: number | any;

  userForm: FormGroup;

  constructor(public fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private alertController: AlertController) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required]
    });
  }


  ngOnInit() {
    // URL parametresinden 'id' değerini al
    this.userId = this.route.snapshot.paramMap.get('id');  // 'id' parametresini alıyoruz   
    console.log('this.userId => ', this.userId)
    
    this.authService.getUser(this.userId).subscribe(
      (user: User) => {
        this.user = user;
        this.userForm.patchValue(user);
      },
      error => {
        console.error('Error fetching user details', error);
      }
    );
    
    // 'id' parametresine göre kullanıcıyı bul
    // this.user = this.users.find((user:any) => user.id == userId);
    // console.log('this.users => ', this.users)
    // console.log('this.user => ', this.user)

    // Eğer kullanıcı bulunduysa, formu güncelle
    // if (this.user) {
    //   this.userForm = this.fb.group({
    //     firstName: [this.user.firstName],
    //     lastName: [this.user.lastName],
    //     username: [this.user.username],
    //     email: [this.user.email],
    //     phoneNumber: [this.user.phoneNumber],
    //     role: [this.user.role],
    //   });
    // }
    // this.userForm = this.fb.group({
    //   firstName: [this.user.firstName, Validators.required],
    //   lastName: [this.user.lastName, Validators.required],
    //   username: [this.user.username, Validators.required],
    //   email: [this.user.email, [Validators.required, Validators.email]],
    //   phoneNumber: [this.user.phoneNumber, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    //   role: [this.user.role, Validators.required],
    // });
  }

  
  updateUser() {
    if (this.userForm.valid) {
      this.authService.updateUser(this.userId!, this.userForm.value).subscribe(
        response => {
          console.log('User updated successfully', response);
          this.router.navigate(['/user-list']).then(async c =>{
            const warningAlert = await this.alertController.create({
              header: 'Başarılı!',
              message: 'Kullanıcı bilgileri güncellendi.',
              buttons: ['Tamam']
            });
            await warningAlert.present();

            await warningAlert.onDidDismiss();

            window.location.reload();
          });
        },
        error => {
          console.error('Error updating user', error);
        }
      );
    }
  }


}
