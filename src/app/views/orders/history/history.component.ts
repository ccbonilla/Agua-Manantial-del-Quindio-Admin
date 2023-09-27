import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/orders/orders.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DetailOrderComponent } from '../detail-order/detail-order.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  titles: string[] = [
    'id',
    'Fecha_de_entrega',
    'Cliente',
    'Direccion',
    'Valor',
  ];
  orders: Order[] = [];
  dataSource: MatTableDataSource<Order>;
  customer_id: number = 0;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    this.dataSource = new MatTableDataSource(this.orders);
  }
  ngOnInit(): void {
    this.activatedRouter.params.subscribe((params) => {
      this.customer_id = params['customer_id'];
    });
    this.getOrders();
  }

  getOrders() {
    this.orderService.get('list').subscribe((orders) => {
      this.orders = orders.filter(
        (order) => order.user_id == this.user.user_id
      );
      this.dataSource = new MatTableDataSource(this.orders);
      if (this.orders.length === 0) {
        Swal.fire({
          title: 'El cliente no tiene historial de pedidos!',
          icon: 'warning',
        });
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
  goToCustomers() {
    this.router.navigate(['customers']);
  }
}
