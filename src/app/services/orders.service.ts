import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { Order } from '../models/order';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl: string = 'http://localhost:5203/orders';

  constructor(private http: HttpClient, private logger: LoggerService) {
    this.logger.logInfo('OrdersService initialized');
  }

  getAllOrders(): Observable<Order[]> {
    this.logger.logInfo('Fetching all orders');
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(res => res?.data ?? [])
    );
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    this.logger.logInfo('Fetching orders by userId', { userId });
    return this.http.get<any>(`${this.baseUrl}/user/${userId}`).pipe(
      map(res => res?.data ?? [])
    );
  }

  getOrderById(id: number): Observable<Order | null> {
    this.logger.logInfo('Fetching order by id', { orderId: id });
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  addOrder(order: Order): Observable<Order> {
    this.logger.logInfo('Adding new order', order);
    return this.http.post<Order>(this.baseUrl, order);
  }

  updateOrderToShippedById(id: number, order: Order): Observable<Order | null> {
    this.logger.logInfo('Updating order to shipped', { orderId: id });
    return this.http.put<Order>(`${this.baseUrl}/shipped/${id}`, order);
  }

  updateOrderToShippedProductById(id: number, order: Order, pid: number | undefined): Observable<Order | null> {
    this.logger.logInfo('Updating order product to shipped', { orderId: id, productId: pid });
    return this.http.put<Order>(`${this.baseUrl}/shipped-product/${id}?pid=${pid}`, order);
  }

  updateOrderToDeliveredById(id: number, order: Order): Observable<Order | null> {
    this.logger.logInfo('Updating order to delivered', { orderId: id });
    return this.http.put<Order>(`${this.baseUrl}/delivered/${id}`, order);
  }
  updateOrderToDeliveredProductById(id: number, order: Order, pid: number | undefined): Observable<Order | null> {
    this.logger.logInfo('Updating order product to delivered', { orderId: id, productId: pid });
    return this.http.put<Order>(`${this.baseUrl}/delivered-product/${id}?pid=${pid}`, order);
  }
}