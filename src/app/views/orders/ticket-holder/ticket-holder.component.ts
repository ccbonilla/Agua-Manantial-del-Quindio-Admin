import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { TicketHolder } from 'src/app/models/ticket_holder';
import { TicketService } from 'src/app/services/tickets/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ticket-holder',
  templateUrl: './ticket-holder.component.html',
  styleUrls: ['./ticket-holder.component.scss']
})
export class TicketHolderComponent implements OnInit{
  formGroup!:FormGroup
  last_ticket : string = ''
  ticket_holder : TicketHolder = new TicketHolder();

  constructor(private formBuilder : FormBuilder, private ticketService : TicketService){
  }
  ngOnInit(): void {


    this.getActiveTicketHolder();
    this.getLastTicket();
    this.formGroup = this.formBuilder.group({
      first_ticket: [null, [Validators.required]],
      last_ticket: [null, [Validators.required]],
      prefix: [null, [Validators.required]],

    });
  }

  getActiveTicketHolder(){
    this.ticketService.getActiveTicketHolder('active-ticket-holder').subscribe((res)=>{
      this.ticket_holder = res;

    })
  }
  getLastTicket(){
    this.ticketService.getLastTicketByHolder('find-last-ticket-by-ticket-holder/1').subscribe((res)=>{
      this.last_ticket = res.secuence
    })
  }

  updateTicketHolder(){
    this.ticketService.updateTicketHolder(`update-ticket-holder/${this.ticket_holder.ticket_holder_id}`,this.ticket_holder).subscribe((res)=>{
      Swal.fire({
        title: '¡Se ha actualizado correctamente!',
        icon:'success'
      }).then(res=>{
        window.location.reload()
      })
    })
  }

  close(){
    window.location.reload()
  }


}
