import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';
import { User } from 'src/app/models/comment';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.page.html',
  styleUrls: ['./user-edit.page.scss'],
})
export class UserEditPage implements OnInit {
  user: any = {};
  userId: number | any;
  userForm: FormGroup;

  constructor(public fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private alertController: AlertController, private logger: LoggerService) {
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
    this.userId = this.route.snapshot.paramMap.get('id');
    this.logger.logInfo('UserEditPage ngOnInit', { userId: this.userId });
    this.authService.getUser(this.userId).subscribe(
      (user: User) => {
        this.user = user;
        this.userForm.patchValue(user);
        this.logger.logInfo('User loaded for edit', user);
      },
      error => {
        this.logger.logError('Error fetching user details', error);
      }
    );
  }

  updateUser() {
    if (this.userForm.valid) {
      this.logger.logInfo('User update attempt', this.userForm.value);
      this.authService.updateUser(this.userId!, this.userForm.value).subscribe(
        response => {
          this.logger.logInfo('User updated successfully', response);
          this.router.navigate(['/user-list']).then(async () => {
            const successAlert = await this.alertController.create({
              header: 'Success!',
              message: 'User information updated.',
              buttons: ['OK']
            });
            await successAlert.present();
            await successAlert.onDidDismiss();
            window.location.reload();
          });
        },
        error => {
          this.logger.logError('Error updating user', error);
        }
      );
    }
  }
}