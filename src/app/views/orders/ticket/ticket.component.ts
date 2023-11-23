import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProductOrder } from 'src/app/models/product_order';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/models/order';
import { InfoService } from 'src/app/services/infoService/info.service';
import { TicketService } from 'src/app/services/tickets/ticket.service';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  dataSource: MatTableDataSource<ProductOrder>;
  productos: ProductOrder[] = [];
  order = new Order();
  ticket: string = '';
  titles: string[] = [
    'ref',
    'descripcion',
    'valor_unitario',
    'cantidad',
    'valor_total',
  ];
  subtotal = 0;
  @ViewChild('htmlTicket') private htmlTicket!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private infoService: InfoService,
    private ticketService : TicketService
  ) {

    this.order = this.data.order;
    this.ticket = this.data.ticketNumber;
    this.order.products.forEach((prod) => {
      this.subtotal += prod.value * prod.product_cant;
    });

    this.dataSource = new MatTableDataSource(this.order.products);
  }
  ngOnInit(): void {}



  sendTicket() {
    this.ticketService.createTicket('create',{
      order_id: this.order.order_id,
      ticket_holder_id : 1,
      secuence: this.data.ticketNumber
    }).subscribe((res)=>{
      const pdf = new jsPDF('portrait', 'pt', 'letter');

      const options = {
        scale: 2,
        useCORS: true,
      };

      html2canvas(this.htmlTicket.nativeElement, options).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, 600, 800);
        pdf.save(`factura#${this.ticket}.pdf`);
        window.location.reload();

      });
      pdf.autoPrint()
    })

  }

  close(){
    window.location.reload();
  }
}
