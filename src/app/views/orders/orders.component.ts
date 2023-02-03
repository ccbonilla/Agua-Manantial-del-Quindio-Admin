import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

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
  titles = [
    'N°',
    'Fecha de pedido',
    'Cliente',
    'Dirección',
    'Cantidad',
    'valor',
  ];
  orders = [
    {
      order_id: 1,
      order_date: '2023-02-02',
      value: 40000,
      user: 'Abogados Del Quindío',
      address: 'Arco Iris manzana O casa 2',
      quantity: 5,
    },
    {
      order_id: 2,
      order_date: '2023-02-02',
      value: 16000,
      user: 'Taxistas Del Quindío',
      address: 'La Pavona Manzana G casa 16',
      quantity: 2,
    },
    {
      order_id: 3,
      order_date: '2023-02-02',
      value: 40000,
      user: 'Iglesia de Dios',
      address: 'La Castilla manzana O casa 2',
      quantity: 5,
    },
    {
      order_id: 4,
      order_date: '2023-02-02',
      value: 16000,
      user: 'Ebanistas Del Quindío',
      address: 'La Clarita Manzana G casa 16',
      quantity: 2,
    },
  ];
  title = 'Pedidos';
  constructor() {}

  ngOnInit(): void {}
  logOut() {}
}
