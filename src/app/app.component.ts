import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService } from './services/logger.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private logger: LoggerService) { }

  ngOnInit() {
    const auth = localStorage.getItem('auth');
    if (auth === 'true' && ['/', '/home', '/login', '/register'].indexOf(window.location.pathname) !== -1) {
    } else if ((!auth || auth !== 'true') && window.location.pathname === '/products') {
    }
  }
}
