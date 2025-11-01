import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductRequest } from '../models/product';
import { Observable } from 'rxjs';
import { Mail } from '../models/mail';
import { LoggerService } from 'src/app/services/logger.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private baseUrl: string = `${environment.apiUrl}/auth/send-mail`;

  constructor(
    private http: HttpClient, 
    private logger: LoggerService
  ) {}

  sendMail(mail: Mail): Observable<Mail> {
    return this.http.post<Mail>(this.baseUrl, mail);
  }
}