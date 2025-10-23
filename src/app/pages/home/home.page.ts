import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Role } from '../../models/comment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  isLoggedIn = false;
  currentRole: Role = Role.User;
  currentRoleText = '';
  currentUserId?: number;
  currentUser: any;

  constructor(private authService: AuthService, private router: Router, private logger: LoggerService) {
    this.logger.info('HomePage loaded');
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.loggedIn();
    const role = this.authService.getCurrentRoles();
    switch (role) {
      case Role.User:
        this.currentRole = Role.User;
        this.currentRoleText = 'Customer';
        break;
      case Role.Seller:
        this.currentRole = Role.Seller;
        this.currentRoleText = 'Seller';
        break;
      case Role.Admin:
        this.currentRole = Role.Admin;
        this.currentRoleText = 'Admin';
        break;
      default:
        this.currentRole = Role.User;
        this.currentRoleText = 'User';
        break;
    }

    if (this.isLoggedIn) {
      this.currentUserId = this.authService.getCurrentUserId();
      this.authService.getUser(this.currentUserId).subscribe({
        next: user => {
          this.currentUser = user;
        },
        error: err => {
          // Error handling for user fetch
          this.logger.error('Failed to fetch user', err);
        }
      });
    }
  }

  logOut(): void {
  this.logger.info('User logged out from HomePage');
  this.authService.logout();
    this.router.navigate(['/']).then(() => window.location.reload());
  }
}
