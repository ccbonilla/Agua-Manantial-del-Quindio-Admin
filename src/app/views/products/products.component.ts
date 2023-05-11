import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/products/product.service';
import { ProductReviewComponent } from './product-review/product-review.component';
import { Product } from '../../models/product';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CreateProductComponent } from './create-product/create-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  titles = ['Código Producto', 'Nombre', 'Descripción', 'Valor'];
  products: Product[] = [];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  logOut() {}

  getProducts() {
    this.productService.get('list').subscribe((prods) => {
      this.products = prods;
    });
  }
  openDialog(itemSelected: Product) {
    const position: DialogPosition = {
      left: '30%',
      top: '-220px',
    };
    const dialogRef = this.dialog.open(ProductReviewComponent, {
      height: '400px',
      width: '630px',
      position: position,
      data: itemSelected,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.getProducts();
    });
  }
  openDialogNew() {
    const position: DialogPosition = {
      left: '30%',
      top: '-220px',
    };
    const dialogRef = this.dialog.open(CreateProductComponent, {
      height: '400px',
      width: '630px',
      position: position,
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
}
