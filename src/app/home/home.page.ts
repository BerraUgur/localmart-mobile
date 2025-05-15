import { Component } from '@angular/core';
import { User } from '../shared/services/comment';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  isLogging = false;
  currentRole:any = 1;
  currentRoleText:any = '';
  currentUserId?:Number | any;
  currentUser?:User;
  isVisitor:any = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLogging = this.authService.loggedIn()
    this.currentRole = this.authService.getCurrentRoles()
    console.log(this.currentRole)
    if (this.currentRole == 'User') {
      this.currentRoleText = 'Müşteri'
    }else if (this.currentRole == 'Seller') {
      this.currentRoleText = 'Satıcı'
    }else if (this.currentRole == 'Admin') {
      this.currentRoleText = 'Admin'
    }else{
      this.isVisitor = true
    }

    
    if(this.isLogging){
      this.currentUserId = this.authService.getCurrentUserId()
      this.authService.getUser(this.currentUserId).subscribe(user => {
        this.currentUser = user
        console.log(this.currentUser)
        console.log(this.currentUser)
      })
    }
    
  }

  logOut(){
    this.authService.logout()
    this.router.navigate(['/']).then(c=>window.location.reload())
  }
  
}
