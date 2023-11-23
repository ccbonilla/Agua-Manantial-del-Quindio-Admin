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
  ordersGroup: Order[] = [];

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
  getOrders() {
    this.orderService.get('list').subscribe((orders) => {
      this.orders = orders;
      this.selectOrdersGroup(0);
    });
  }
  selectOrdersGroup(index: number) {
    if (index == 0) {
      this.ordersGroup = this.orders.filter((order) => order.order_state == 1);
      this.dataSource = new MatTableDataSource(this.ordersGroup);

      if (this.ordersGroup.length === 0) {
        Swal.fire({
          title: 'No tienes pedidos pendientes por entregar!',
          icon: 'warning',
        });
      }
    } else if (index == 1) {
      this.ordersGroup = this.orders.filter((order) => order.order_state == 2);
      if (this.ordersGroup.length === 0) {
        Swal.fire({
          title: 'No tienes pedidos en ruta!',
          icon: 'warning',
        });
      }
      this.dataSource = new MatTableDataSource(this.ordersGroup);
    } else if (index == 2) {
      this.ordersGroup = this.orders.filter((order) => order.order_state == 3);
      if (this.ordersGroup.length === 0) {
        Swal.fire({
          title: 'No tienes pedidos entregados!',
          icon: 'warning',
        });
      }
      this.dataSource = new MatTableDataSource(this.ordersGroup);
    } else {
      this.ordersGroup = this.orders.filter((order) => order.order_state == 4);
      if (this.ordersGroup.length === 0) {
        Swal.fire({
          title: 'No tienes pedidos cancelados!',
          icon: 'warning',
        });
      }
    }
    this.dataSource = new MatTableDataSource(this.ordersGroup);
  }
  openDialogOrderReview(order: Order) {
    console.log('entra');

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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
