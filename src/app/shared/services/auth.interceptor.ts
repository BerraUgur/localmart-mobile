import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // LocalStorage'den token'ı al
    const token = localStorage.getItem('token');

    // Eğer token varsa, Authorization başlığını ekle
    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      // console.log('Token added to request:', `Bearer ${token}`);
      return next.handle(clonedReq);
    }

    // Token yoksa, orijinal isteği olduğu gibi gönder
    return next.handle(req);
  }
}
