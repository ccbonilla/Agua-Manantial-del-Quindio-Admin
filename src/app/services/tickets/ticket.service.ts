import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';
import { Ticket } from 'src/app/models/ticket';
import { TicketHolder } from 'src/app/models/ticket_holder';
import { environment } from '../../../environments/environment';

const BACKEND_BASE_URL = 'http://localhost:3000';


@Injectable()
export class TicketService {
  private BASE_URL: string = BACKEND_BASE_URL+'/ticket';

  constructor(private http: HttpClient) {}

  getLastTicketByHolder(url: string): Observable<Ticket> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as Ticket));
  }
  createTicket(url: string, data: Ticket): Observable<Ticket> {
    console.log('crear factura', data,`${this.BASE_URL}/${url}`);

    return this.http
      .post(`${this.BASE_URL}/${url}`, data)
      .pipe(map((response) => response as Ticket));
  }
  getActiveTicketHolder(url: string): Observable<TicketHolder> {
    return this.http
      .get(`${this.BASE_URL}/${url}`)
      .pipe(map((response) => response as TicketHolder));
  }
  updateTicketHolder(url:string, data : TicketHolder):Observable<TicketHolder>{
    return this.http.put(`${this.BASE_URL}/${url}`,data)
    .pipe(map((response) => response as TicketHolder));
  }
}
