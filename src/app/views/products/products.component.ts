import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/products/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  titles = ['Código Producto', 'Nombre', 'Descripción', 'Valor'];
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  logOut() {}

  getProducts() {
    this.productService.get('list').subscribe((prods) => {
      console.log('prods', prods);
      this.products = prods;
    });
  }
}
