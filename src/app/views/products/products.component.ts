import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  titles = ['Código Producto', 'Nombre', 'Descripción', 'Valor'];
  products = [
    {
      id: 1,
      name: 'Botellón 20 Lts',
      description: 'Botellón agua 20 litros',
      value: 8000,
    },
    {
      id: 2,
      name: 'Agua Bolsa 600 ml',
      description: 'Agua en bolsa 600 ml x 24 unidades',
      value: 5000,
    },
    {
      id: 3,
      name: 'Soporte Botellón 20 Lts',
      description: 'Soporte metálico para botellón agua 20 litros',
      value: 20000,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  logOut() {}
}
