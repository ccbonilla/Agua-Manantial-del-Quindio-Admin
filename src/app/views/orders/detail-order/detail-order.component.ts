import { Component, OnInit, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/models/order';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/services/orders/orders.service';
import { UserService } from 'src/app/services/users/users.service';
import { ProductOrder } from 'src/app/models/product_order';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss'],
})
export class DetailOrderComponent implements OnInit {
  // order: Order = new Order();
  // user: User = new User();
  // productList: ProductOrder[] = [];
  dataSource: MatTableDataSource<ProductOrder>;
  titles: string[] = ['id', 'name', 'cant'];
  customerFormGroup!: FormGroup;
  orderFormGroup!: FormGroup;
  formData = new FormData();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public order: Order
  ) {
    this.dataSource = new MatTableDataSource(this.order.products);
  }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.customerFormGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
    });
    this.orderFormGroup = this.formBuilder.group({
      order_date: [null, [Validators.required]],
      value: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      products: [null, [Validators.required]],
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
    this.orderService
      .put(`update/${this.order.order_id}`, this.order)
      .subscribe((sub) => {
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

  getOrder(order_id: number) {
    this.orderService
      .getOrderById(`find-by-id/${order_id}`)
      .subscribe((sub) => {
        console.log('order', sub);

        this.order = sub;
      });
  }
  // getUser(user_id: number) {
  //   this.userService.getUserById(`find-by-id/${user_id}`).subscribe((sub) => {
  //     this.user = sub;
  //     console.log('user', this.user);
  //   });
  // }
}
