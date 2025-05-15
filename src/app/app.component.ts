import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(private router: Router) {}

  ngOnInit() {
    const auth = localStorage.getItem('auth');
    if (auth === 'true' && ['/', '/home', '/login', '/register'].indexOf(window.location.pathname) !== -1) {
      // this.router.navigate(['/products']);
    } else if ((!auth || auth !== 'true') && window.location.pathname === '/products') {
      // this.router.navigate(['/home']);
    }
  }
}
