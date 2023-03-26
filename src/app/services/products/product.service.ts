import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
@Injectable()
export class ProductService {
  private BASE_URL: string = 'http://localhost:3000/product';
  constructor(private http: HttpClient) {}

  get(url: string): Observable<Product[]> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as Product[]));
  }
}
