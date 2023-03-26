import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Order } from 'src/app/models/order';
import { OrderService } from '../../services/orders/orders.service';
import { OrderReviewComponent } from './modal/order-review/order-review.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class OrdersComponent implements OnInit {
  titles = ['N°', 'Fecha de pedido', 'Cliente', 'Dirección', 'valor'];
  orders: Order[] = [];

  title = 'Pedidos';
  showModal = false;
  selectedItem: any;
  modalRef: any;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }
  logOut() {}
  getOrders() {
    this.orderService.get('list').subscribe((orders) => {
      this.orders = orders;
    });
  }
  openDialog(itemSelected: Order) {
    const position: DialogPosition = {
      left: '30%',
      top: '-220px',
    };
    const dialogRef = this.dialog.open(OrderReviewComponent, {
      height: '560px',
      width: '630px',
      position: position,
      data: itemSelected,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getOrders();
    });
  }
  deleteOrder(itemSelected: Order) {
    Swal.fire({
      title: '¡Hola!',
      text: '¿Está seguro que desea eliminar éste pedido?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService
          .del(`delete/${itemSelected.order_id}`)
          .subscribe((res) => {
            this.getOrders();
          });
      } else {
        this.getOrders();
      }
    });
  }
}
