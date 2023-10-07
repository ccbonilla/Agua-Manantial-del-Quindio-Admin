import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../../models/user';
import { Auth } from 'src/app/models/auth';
import { userType } from 'src/app/models/user_type';
@Injectable()
export class UserService {
  private BASE_URL: string = 'http://localhost:3000/user';
  private BASE_URL_USER_TYPES: string = 'http://localhost:3000/user-type';
  private BASE_URL_USER_AUTH: string = 'http://localhost:3000/user-auth';
  constructor(private http: HttpClient) {}

  get(url: string): Observable<User[]> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as User[]));
  }

  getUserById(url: string): Observable<User> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as User));
  }

  delete(url: string): Observable<any> {
    return this.http
      .delete(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response));
  }
  login(email: string, password: string) {
    const body = { email, password };
    const url = `${this.BASE_URL}/login`;
    return this.http.post<Auth>(url, body).pipe(
      tap((resp) => {
        console.log('resp : ', resp);
      }),
      map((resp) => resp),
      catchError((err) => of(err.error.msg))
    );
  }
  getUserTypes(url: string): Observable<userType[]> {
    return this.http
      .get(`${this.BASE_URL_USER_TYPES}/${url}`)
      .pipe(map((response) => response as userType[]));
  }
  updateUser(url: string, user: User): Observable<User> {
    return this.http
      .put(`${this.BASE_URL}/${url}`, user)
      .pipe(map((response) => response as User));
  }

  createUser(url: string, user: User): Observable<User> {
    return this.http
      .post(`${this.BASE_URL}/${url}`, user)
      .pipe(map((response) => response as User));
  }
  resetPassword(url: string) {
    this.http.get(`${this.BASE_URL_USER_AUTH}/${url}`).subscribe((res) => {
      console.log('res', res);
    });
  }

  updatePassword(url: string, data: any) {
    this.http
      .put(`${this.BASE_URL_USER_AUTH}/${url}`, data)
      .subscribe((res) => {
        console.log('res', res);
      });
  }
}
