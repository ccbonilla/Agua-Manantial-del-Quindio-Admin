import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Section } from 'src/app/models/section';

@Injectable()
export class sectionService {
  private BASE_URL: string = 'http://localhost:3000/section';
  constructor(private http: HttpClient) {}

  get(url: string): Observable<Section[]> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as Section[]));
  }

  put(url: string, data: Section): Observable<any> {
    return this.http
      .put(`${this.BASE_URL}/${url}`, data)
      .pipe(map((response) => response));
  }
}
