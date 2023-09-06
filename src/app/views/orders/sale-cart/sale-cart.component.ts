import { Component, OnInit } from '@angular/core';
import { ProductOrder } from 'src/app/models/product_order';

@Component({
  selector: 'app-sale-cart',
  templateUrl: './sale-cart.component.html',
  styleUrls: ['./sale-cart.component.scss'],
})
export class SaleCartComponent implements OnInit {
  products: ProductOrder[] = [
    {
      product_id: 1,
      product_cant: 12,
      name: '',
      value: 0,
    },
    {
      product_id: 2,
      product_cant: 21,
      name: '',
      value: 0,
    },
  ];
  constructor() {}
  ngOnInit(): void {
    console.log('inicia carrito');
  }

  removeQuantity(product: ProductOrder) {
    product.product_cant--;
  }
  addQuantity(product: ProductOrder) {
    product.product_cant++;
  }
}
