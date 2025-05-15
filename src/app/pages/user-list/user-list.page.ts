import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Role, User } from 'src/app/shared/services/comment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {

  users: User[] = [];
  Role:any | Role;
  nousers: boolean = false;
  constructor(private authService: AuthService, private alertController: AlertController) {
    console.log('constructor');
  }

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
  
  ngOnInit() {
    console.log('ngOnInit');
    this.authService.getUserList().subscribe(
      (data: User[]) => {
        this.users = data;
        console.log('Users fetched successfully', data);
      },
      async error => {
        const warningAlert = await this.alertController.create({
          header: 'Uyarı!',
          message: 'Kullanıcıları getirirken bir hata oluştu.', 
          buttons: ['Tamam']
        });
        await warningAlert.present();
      }
    );
  }

  async deleteUser(userId: number) {
    const alert = await this.alertController.create({
      header: 'Emin misiniz?',
      message: 'Bu kullanıcıyı silmek istediğinize emin misiniz?',
      buttons: [
        {
          text: 'İptal',
          role: 'cancel'
        },
        {
          text: 'Evet',
          handler: () => {
            this.authService.deleteUser(userId).subscribe(
              () => {
                let deletedUser = this.users?.find(user => user.id == userId)
                
                this.alertController.create({
                  header: 'Başarılı!',
                  message: `${deletedUser?.firstName} ${deletedUser?.lastName} Kullanıcı başarıyla silindi.`,
                  buttons: ['Tamam']
                }).then(successAlert => successAlert.present());

                this.users = this.users?.filter(user => user.id !== userId);
              },
              error => {
                console.error('Error deleting user:', error);
              }
            );

          }
        }
      ]
    });
  
    await alert.present();
  }

  
  
}
