import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'src/app/models/order';
import { OrderService } from '../../services/orders/orders.service';
import { Router } from '@angular/router';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { CreateOrderComponent } from './modal/create-order/create-order.component';

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
  titles: string[] = [
    'id',
    'Fecha_de_entrega',
    'Cliente',
    'Direccion',
    'Valor',
    'Acciones',
  ];
  orders: Order[] = [];

  title = 'Pedidos';
  showModal = false;
  selectedItem: any;
  modalRef: any;
  orderModelNew: Order = new Order();
  dataSource: MatTableDataSource<Order>;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.orders);
  }

  ngOnInit(): void {
    this.getOrders();
  }
  logOut() {}
  getOrders() {
    this.orderService.get('list').subscribe((orders) => {
      this.orders = orders.filter(
        (order) => order.order_state != 3 && order.order_state != 4
      );

      this.dataSource = new MatTableDataSource(this.orders);
    });
  }
  openDialogOrderReview(order: Order) {
    const dialogRef = this.dialog.open(DetailOrderComponent, {
      data: order,
      height: '500px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getOrders();
    });
  }

  createOrder() {
    this.router.navigate(['createOrder', 0]);
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

  changeState(itemSelected: Order, state: number) {
    itemSelected.order_state = state;
    this.orderService
      .put(`update-state/${itemSelected.order_id}`, itemSelected)
      .subscribe((res) => {
        this.getOrders();
      });
  }
}
