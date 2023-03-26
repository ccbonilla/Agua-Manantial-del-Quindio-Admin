import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../services/users/users.service';
import { OrderService } from '../../services/orders/orders.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  titles = [
    'Código Cliente',
    'Nombre',
    'Correo',
    'Dirección',
    'Tipo de cliente',
    'Compras acumuladas',
  ];
  customers: User[] = [];
  // customers = [
  //   {
  //     id: 1,
  //     name: 'Juan Gabriel',
  //     lastname: 'Velasquez Blanco',
  //     email: 'jvaguaenbotellon@outlook.com',
  //     address: 'Villa Liliana Mz S casa 15',
  //     type: 'Administrador',
  //     count: 0,
  //   },
  //   {
  //     id: 2,
  //     name: 'John William',
  //     lastname: 'Reyes Garaviz',
  //     email: 'johnwilliam_reyes@hotmail.com',
  //     address: 'La Pavona Manzana G casa 16',
  //     type: '5 x 1',
  //     count: 5,
  //   },
  //   {
  //     id: 3,
  //     name: 'Cristian Camilo',
  //     lastname: 'Bonilla Rincón',
  //     email: 'ccbonillar@uqvirtual.edu.co',
  //     address: 'Villa Hermosa Mz S casa 15',
  //     type: '6 x 1',
  //     count: 5,
  //   },
  // ];
  constructor(
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.get('list').subscribe((users) => {
      this.customers = users;
    });
  }
}
