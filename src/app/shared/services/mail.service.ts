import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductRequest } from './product';
import { Observable } from 'rxjs';
import { Mail } from './mail';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private baseUrl: string = 'http://localhost:5203/auth/send-mail';

  constructor(private http: HttpClient) {}

  sendMail(mail: Mail): Observable<Mail> {
    return this.http.post<Mail>(this.baseUrl, mail);
  }
  
}
