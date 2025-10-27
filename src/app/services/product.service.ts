import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductRequest } from '../models/product';
import { Observable } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl: string = 'http://localhost:5203/products';

  constructor(private http: HttpClient, private logger: LoggerService) {
    this.logger.logInfo('ProductService initialized');
  }

  getAllProducts(): Observable<any> {
    this.logger.logInfo('Fetching all products');
    return this.http.get<any>(this.baseUrl);
  }

  getProductById(id: number): Observable<any> {
    this.logger.logInfo('Fetching product by id', { id });
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: ProductRequest): Observable<Product> {
    this.logger.logInfo('Creating product', product);
    return this.http.post<Product>(this.baseUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<void> {
    this.logger.logInfo('Updating product', { id, product });
    return this.http.put<void>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    this.logger.logInfo('Deleting product', { id });
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}