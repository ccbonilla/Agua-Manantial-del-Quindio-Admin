import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/products/product.service';
import { ProductReviewComponent } from './product-review/product-review.component';
import { Product } from '../../models/product';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CreateProductComponent } from './create-product/create-product.component';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  titles = ['Id', 'Nombre', 'Descripcion', 'Valor', 'Eliminar'];
  products: Product[] = [];
  dataSource: MatTableDataSource<Product>;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.products);
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.get('list').subscribe((prods) => {
      this.products = prods;
      this.dataSource = new MatTableDataSource(this.products);
    });
  }
  reviewProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductReviewComponent, {
      data: product,
      height: '350px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getProducts();
    });
  }
  createProduct() {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      height: '350px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getProducts();
    });
  }
  deleteProduct(itemSelected: Product) {
    Swal.fire({
      title: '¡Hola!',
      text: '¿Está seguro que desea eliminar éste producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService
          .del(`delete/${itemSelected.product_id}`)
          .subscribe((res) => {
            this.getProducts();
          });
      } else {
        this.getProducts();
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
