import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/services/orders/orders.service';
import { UserService } from 'src/app/services/users/users.service';
import { ProductService } from 'src/app/services/products/product.service';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  userModel!: User[];
  productList!: Product[];
  state_options: any[] = [];
  orderModel: Order = new Order();
  productModel: Product = new Product();
  dataSourceUser: MatTableDataSource<User>;
  dataSourceProduct: MatTableDataSource<Product>;
  displayedColumns: string[] = ['name', 'lastName', 'address', 'phone'];
  displayedColumnsproduct: string[] = ['name', 'description', 'value'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort = new MatSort();
  selected: Date | null;
  productQuantity: number = 0;

  constructor(
    private _formBuilderDate: FormBuilder,
    private _formBuilderUser: FormBuilder,
    private _formBuilderProduct: FormBuilder,
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
    private router: Router,
    private dialogRef: MatDialogRef<CreateOrderComponent>
  ) {
    this.dataSourceUser = new MatTableDataSource(this.userModel);
    this.dataSourceProduct = new MatTableDataSource(this.productList);
    this.selected = new Date();
  }
  ngOnInit(): void {
    this.createForm();
    this.getCustomers();
    this.getProducts();
  }
  createForm() {
    this.firstFormGroup = this._formBuilderUser.group({
      nameCustomer: [null, [Validators.required]],
      lastNameCustomer: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });
    this.secondFormGroup = this._formBuilderProduct.group({
      nameProduct: [null, [Validators.required]],
      descriptionProduct: [null, [Validators.required]],
      valueProduct: [null, [Validators.required]],
    });
    // this.thirdFormGroup = this._formBuilderDate.group({
    //   date: [null, [Validators.required]],
    //   productQuantity: [null, [Validators.required]],
    //   labelProduct: [null, [Validators.required]],
    // });
  }

  selectCustomer(customer: User, stepper: MatStepper) {
    this.orderModel.customer = customer;
    stepper.next();
  }
  selectProduct(product: Product, stepper: MatStepper) {
    this.productModel = product;
    Swal.fire({
      title: 'Ingrese la cantidad de producto',
      input: 'number',
      inputPlaceholder: 'Cantidad',
      confirmButtonText: 'Enviar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productQuantity = result.value;
        Swal.fire({
          title: 'Seleccione una fecha:',
          html: '<input type="date" id="swal-input1" class="swal2-input">',
          confirmButtonText: 'Enviar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        }).then((result2) => {
          if (result2.isConfirmed) {
            console.log('result', result2);

            this.orderModel.order_date = (
              document.getElementById('swal-input1') as HTMLInputElement
            ).value;
            this.createOrder();
          }
        });
      }
    });
  }
  createOrder() {
    let orderNew = new Order();
    orderNew.discount = 0;
    orderNew.order_date = this.orderModel.order_date;
    orderNew.order_state = 1;
    orderNew.user_id = this.orderModel.customer.user_id;
    orderNew.payment_type_id = 1;
    orderNew.value = this.productModel.value * Number(this.productQuantity);
    orderNew.product_cant = this.productQuantity;
    orderNew.product_id = this.productModel.product_id;

    this.orderService.post('create', orderNew).subscribe((sub) => {
      this.dialogRef.close();
      this.router.navigate(['orders']);
    });
  }

  getCustomers() {
    this.userService.get('list').subscribe((sub) => {
      this.dataSourceUser = new MatTableDataSource(sub);
      this.dataSourceUser.paginator = this.paginator;
      this.dataSourceUser.sort = this.sort;
    });
  }
  getProducts() {
    this.productService.get('list').subscribe((sub) => {
      this.dataSourceProduct = new MatTableDataSource(sub);
      this.dataSourceProduct.paginator = this.paginator;
      this.dataSourceProduct.sort = this.sort;
    });
  }
}
