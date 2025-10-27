import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';
import { Role, User } from 'src/app/models/comment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss'],
})
export class UserListPage implements OnInit {

  users: User[] = [];
  Role: any | Role;
  nousers: boolean = false;
  constructor(private authService: AuthService, private alertController: AlertController, private logger: LoggerService) {
    this.logger.logInfo('UserListPage initialized');
  }

  ngOnInit() {
    this.logger.logInfo('UserListPage ngOnInit');
    this.authService.getUserList().subscribe(
      (data: User[]) => {
        this.users = data;
        this.logger.logInfo('Users fetched successfully', data);
      },
      async error => {
        this.logger.logError('Error fetching users', error);
        const warningAlert = await this.alertController.create({
          header: 'Warning!',
          message: 'An error occurred while fetching users.',
          buttons: ['OK']
        });
        await warningAlert.present();
      }
    );
  }

  async deleteUser(userId: number) {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.authService.deleteUser(userId).subscribe(
              () => {
                let deletedUser = this.users?.find(user => user.id == userId);
                this.logger.logInfo('User deleted', deletedUser);
                this.alertController.create({
                  header: 'Success!',
                  message: `${deletedUser?.firstName} ${deletedUser?.lastName} was deleted successfully.`,
                  buttons: ['OK']
                }).then(successAlert => successAlert.present());
                this.users = this.users?.filter(user => user.id !== userId);
              },
              error => {
                this.logger.logError('Error deleting user', error);
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }
}