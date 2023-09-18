import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Order } from '../../models/order';
@Injectable()
export class OrderService {
  private BASE_URL: string = 'http://localhost:3000/order';
  constructor(private http: HttpClient) {}

  get(url: string): Observable<Order[]> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as Order[]));
  }
  getOrderById(url: string): Observable<Order> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as Order));
  }
  getStates(url: string): Observable<any> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response));
  }
  put(url: string, data: Order): Observable<any> {
    return this.http
      .put(`${this.BASE_URL}/${url}`, data)
      .pipe(map((response) => response));
  }
  del(url: string): Observable<any> {
    return this.http
      .delete(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response));
  }
  post(url: string, data: Order): Observable<any> {
    return this.http
      .post(`${this.BASE_URL}/${url}`, data)
      .pipe(map((response) => response));
  }
}
