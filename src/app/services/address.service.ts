import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Address } from '../models/address';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private baseUrl: string = 'http://localhost:5203/address';

  constructor(private http: HttpClient, private logger: LoggerService) {
    this.logger.info('AddressService initialized');
  }

  getAddressByProductId(productId: number): Observable<Address[]> {
    this.logger.info('Fetching address by product id', { productId });
    return this.http.get<Address[]>(`${this.baseUrl}/product/${productId}`);
  }

  getAddressById(id: number): Observable<Address | null> {
    this.logger.info('Fetching address by id', { id });
    return this.http.get<Address>(`${this.baseUrl}/${id}`);
  }

  addAddress(address: Address): Observable<Address> {
    this.logger.info('Adding address', address);
    return this.http.post<Address>(this.baseUrl, address);
  }

  updateAddress(id: number, address: Address): Observable<Address> {
    this.logger.info('Updating address', { id, address });
    return this.http.put<Address>(`${this.baseUrl}/${id}`, address);
  }

  deleteAddress(id: number): Observable<void> {
    this.logger.info('Deleting address', { id });
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}