import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/users/users.service';
import { OrderService } from '../../services/orders/orders.service';
import { CreateOrderComponent } from '../orders/modal/create-order/create-order.component';
import { CustomerReviewComponent } from './customer-review/customer-review.component';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'src/app/models/order';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { HistoryComponent } from '../orders/history/history.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  titles = [
    'Id',
    'Nombre',
    'Correo',
    'Direccion',
    'Compras',
    'Eliminar',
    'Pedido',
    'Historial',
  ];
  customers: User[] = [];
  orderModelNew: Order = new Order();
  dataSource: MatTableDataSource<User>;
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private route: Router
  ) {
    this.dataSource = new MatTableDataSource(this.customers);
  }

  ngOnInit(): void {
    this.getUsers();
  }
  openDialogOrderReview(user: User) {
    const dialogRef = this.dialog.open(CustomerReviewComponent, {
      data: user,
      height: '500px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUsers();
    });
  }

  openDialogOrderHistory(user: User) {
    const dialogRef = this.dialog.open(HistoryComponent, {
      data: user,
      height: '500px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUsers();
    });
  }
  getUsers() {
    this.userService.get('list').subscribe((users) => {
      this.customers = users;
      this.dataSource = new MatTableDataSource(this.customers);
    });
  }

  createCustomer() {
    const dialogRef = this.dialog.open(CreateCustomerComponent, {
      height: '500px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUsers();
    });
  }
  createOrder(user_id: number) {
    this.route.navigate(['createOrder', user_id]);
  }

  deleteCustomer(user_id: number) {
    Swal.fire({
      title: '¡Hola!',
      text: '¿Está seguro que desea eliminar éste cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(`delete/${user_id}`).subscribe((resp) => {
          this.getUsers();
        });
      } else {
        this.getUsers();
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
}
