import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductRequest } from '../models/product';
import { Observable } from 'rxjs';
import { Mail } from '../models/mail';
import { LoggerService } from 'src/app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private baseUrl: string = 'http://localhost:5203/auth/send-mail';

  constructor(private http: HttpClient, private logger: LoggerService) {
    this.logger.info('MailService initialized');
  }

  sendMail(mail: Mail): Observable<Mail> {
    this.logger.info('Sending mail', mail);
    return this.http.post<Mail>(this.baseUrl, mail);
  }
}