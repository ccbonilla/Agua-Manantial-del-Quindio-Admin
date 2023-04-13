import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Info } from 'src/app/models/info';

@Injectable()
export class InfoService {
  private BASE_URL: string = 'http://localhost:3000/info';
  constructor(private http: HttpClient) {}

  get(url: string): Observable<Info> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as Info));
  }

  put(url: string, data: Info): Observable<any> {
    return this.http
      .put(`${this.BASE_URL}/${url}`, data)
      .pipe(map((response) => response));
  }
}
