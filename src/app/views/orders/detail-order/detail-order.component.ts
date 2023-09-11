import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/services/orders/orders.service';
import { Product } from 'src/app/models/product';
import { ProductOrder } from 'src/app/models/product_order';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss'],
})
export class DetailOrderComponent implements OnInit {
  order: Order = new Order();
  dataSource: MatTableDataSource<ProductOrder>;
  titles: string[] = ['id', 'name', 'cant'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {
    this.dataSource = new MatTableDataSource(this.order.products);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['order']) {
        this.order = JSON.parse(params['order']);
        this.dataSource = new MatTableDataSource(this.order.products);
      }
    });
  }

  addCant(product: ProductOrder) {
    product.product_cant++;
  }
  removeCant(product: ProductOrder) {
    product.product_cant--;
  }
  removeProduct(product: ProductOrder) {
    this.order.products.splice(this.order.products.indexOf(product), 1);
    this.dataSource = new MatTableDataSource(this.order.products);
  }
  getTotalValues() {
    let total = 0;
    for (let index = 0; index < this.order.products.length; index++) {
      total +=
        this.order.products[index].value *
        this.order.products[index].product_cant;
    }
    return total;
  }
  goToOrderList() {
    this.router.navigate(['orders']);
  }
  updateOrder() {
    this.orderService.put('update', this.order).subscribe((sub) => {
      Swal.fire({
        title: `Pedido Actualizado correctamente`,
        icon: 'success',
        confirmButtonText: 'Enviar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((response) => {
        if (response.isConfirmed) {
          this.router.navigate(['orders']);
        }
      });
    });
  }
}
