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
import { CreateOrderComponent } from './modal/create-order/create-order.component';
import { Router } from '@angular/router';

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
  orderModelNew: Order = new Order();

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }
  logOut() {}
  getOrders() {
    this.orderService.get('list').subscribe((orders) => {
      this.orders = orders.filter(
        (order) => order.order_state != 3 && order.order_state != 4
      );
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
  createOrder() {
    const position: DialogPosition = {
      left: '10%',
      top: '-150px',
    };
    const dialogRef = this.dialog.open(CreateOrderComponent, {
      data: this.orderModelNew,
      position: position,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getOrders();
    });
  }
  // createOrder() {
  //   this.router.navigate(['createOrder']);
  // }
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

  changeState(itemSelected: Order, state: number) {
    itemSelected.order_state = state;
    this.orderService
      .put(`update-state/${itemSelected.order_id}`, itemSelected)
      .subscribe((res) => {
        this.getOrders();
      });
  }
}
