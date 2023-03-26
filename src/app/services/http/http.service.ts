import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public post<T>(
    url: string,
    model?: any,
    params?: HttpParams,
    urlParams?: any[]
  ): Observable<T> {
    let headers = new HttpHeaders();
    var paramsString = '';
    const URL = 'http://localhost:3000';
    if (urlParams != undefined) {
      paramsString = this.buildUrl(urlParams);
    }

    return this.http
      .post<T>(`${URL}/${url}${paramsString}`, model, { headers, params })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return this.handleError(err);
        })
      );
  }

  public put<T>(
    url: string,
    model?: any,
    params?: HttpParams,
    urlParams?: any[]
  ): Observable<T> {
    let headers = new HttpHeaders();
    var paramsString = '';
    const URL = 'http://localhost:3000;';

    if (urlParams != undefined) {
      paramsString = this.buildUrl(urlParams);
    }
    return this.http
      .put<T>(`${URL}/${url}${paramsString}`, model, { headers, params })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return this.handleError(err);
        })
      );
  }

  public get<T>(
    url: string,
    params?: HttpParams,
    urlParams?: any[]
  ): Observable<T> {
    let headers = new HttpHeaders();
    var paramsString = '';
    const URL = 'http://localhost:3000';

    if (urlParams != undefined) {
      paramsString = this.buildUrl(urlParams);
    }
    return this.http
      .get<T>(`${URL}/${url}${paramsString}`, { headers, params })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return this.handleError(err);
        })
      );
  }

  buildUrl(urlParams: any[]): string {
    return '/' + urlParams.join('/');
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
