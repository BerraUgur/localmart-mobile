import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { Order } from '../models/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private baseUrl: string = 'http://localhost:5203/orders';

  constructor(private http: HttpClient, private logger: LoggerService) {
    this.logger.info('OrdersService initialized');
  }

  getAllOrders(): Observable<Order[]> {
    this.logger.info('Fetching all orders');
    return this.http.get<Order[]>(`${this.baseUrl}`);
  }

  getOrdersByUserId(productId: number): Observable<Order[]> {
    this.logger.info('Fetching orders by userId', { userId: productId });
    return this.http.get<Order[]>(`${this.baseUrl}/user/${productId}`);
  }

  getOrderById(id: number): Observable<Order | null> {
    this.logger.info('Fetching order by id', { orderId: id });
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  addOrder(order: Order): Observable<Order> {
    this.logger.info('Adding new order', order);
    return this.http.post<Order>(this.baseUrl, order);
  }

  updateOrderToShippedById(id: number, order: Order): Observable<Order | null> {
    this.logger.info('Updating order to shipped', { orderId: id });
    return this.http.put<Order>(`${this.baseUrl}/shipped/${id}`, order);
  }

  updateOrderToShippedProductById(id: number, order: Order, pid: number | undefined): Observable<Order | null> {
    this.logger.info('Updating order product to shipped', { orderId: id, productId: pid });
    return this.http.put<Order>(`${this.baseUrl}/shipped/${id}?pid=${pid}`, order);
  }

  updateOrderToDeliveredById(id: number, order: Order): Observable<Order | null> {
    this.logger.info('Updating order to delivered', { orderId: id });
    return this.http.put<Order>(`${this.baseUrl}/delivered/${id}`, order);
  }
  updateOrderToDeliveredProductById(id: number, order: Order, pid: number | undefined): Observable<Order | null> {
    this.logger.info('Updating order product to delivered', { orderId: id, productId: pid });
    return this.http.put<Order>(`${this.baseUrl}/delivered/${id}?pid=${pid}`, order);
  }
}