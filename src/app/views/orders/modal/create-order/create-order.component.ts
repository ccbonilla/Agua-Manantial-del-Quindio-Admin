import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from 'src/app/services/orders/orders.service';
import { UserService } from 'src/app/services/users/users.service';
import { ProductService } from 'src/app/services/products/product.service';
import { Order } from 'src/app/models/order';
import { ProductOrder } from 'src/app/models/product_order';
import { User } from 'src/app/models/user';
import { Product } from 'src/app/models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
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
  userList!: User[];
  state_options: any[] = [];
  orderModel: Order = new Order();
  productsModel: ProductOrder[] = [];
  dataSourceUser: MatTableDataSource<User>;
  dataSourceProduct: MatTableDataSource<Product>;
  dataSourceProductOrder: MatTableDataSource<ProductOrder>;
  displayedColumns: string[] = ['name', 'lastName', 'address', 'phone'];
  displayedColumnsproduct: string[] = ['name', 'description', 'value'];
  displayedColumnsProductOrder: string[] = [
    'nameProduct',
    'value',
    'cant',
    'subtotal',
    'deleteProduct',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort = new MatSort();
  selected: Date | null;
  productQuantity: number = 0;
  next = false;
  customerSelected = false;

  constructor(
    private _formBuilderDate: FormBuilder,
    private _formBuilderUser: FormBuilder,
    private _formBuilderProduct: FormBuilder,
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router // private dialogRef: MatDialogRef<CreateOrderComponent>
  ) {
    this.dataSourceUser = new MatTableDataSource(this.userModel);
    this.dataSourceProduct = new MatTableDataSource(this.productList);
    this.dataSourceProductOrder = new MatTableDataSource(this.productsModel);
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
    if (this.orderModel.customer.user_id > 0) {
      this.next = true;
    }
  }

  selectCustomer(customer: User) {
    this.orderModel.customer = customer;
    this.customerSelected = true;
  }
  selectProduct(product: Product) {
    let newProduct = new ProductOrder();
    Swal.fire({
      title: 'Ingrese la cantidad de producto',
      input: 'number',
      inputPlaceholder: 'Cantidad',
      confirmButtonText: 'Enviar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        newProduct.product_cant = result.value;
        newProduct.product_id = product.product_id;
        newProduct.name = product.name;
        newProduct.value = product.value;
        this.productsModel.push(newProduct);
        this.dataSourceProductOrder = new MatTableDataSource(
          this.productsModel
        );
      }
    });
  }
  createOrder() {
    Swal.fire({
      title: 'Seleccione una fecha:',
      html: '<input type="date" id="swal-input1" class="swal2-input">',
      confirmButtonText: 'Enviar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result2) => {
      if (result2.isConfirmed) {
        this.orderModel.order_date = (
          document.getElementById('swal-input1') as HTMLInputElement
        ).value;
        let orderNew = new Order();
        orderNew.discount = 0;
        orderNew.order_date = this.orderModel.order_date;
        orderNew.order_state = 1;
        orderNew.user_id = this.orderModel.customer.user_id;
        orderNew.payment_type_id = 1;
        orderNew.customer = this.orderModel.customer;
        orderNew.products = this.productsModel;
        this.orderService.post('create', orderNew).subscribe((sub) => {
          Swal.fire({
            title: `Pedido guardado correctamente con un descuento de $${sub.discount}`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
          }).then((response) => {
            if (response.isConfirmed) {
              this.router.navigate(['orders']);
            }
          });
        });
      }
    });
  }

  getCustomers() {
    this.userService.get('list').subscribe((sub) => {
      this.userList = sub;
      this.dataSourceUser = new MatTableDataSource(this.userList);
      this.dataSourceUser.paginator = this.paginator;
      this.dataSourceUser.sort = this.sort;
      this.route.params.subscribe((params) => {
        if (params['customer_id'] != '0') {
          this.orderModel.user_id = JSON.parse(params['customer_id']);
          this.orderModel.customer = this.userList.find(
            (user) => user.user_id == this.orderModel.user_id
          ) as User;
          this.customerSelected = true;
        }
      });
    });
  }
  getProducts() {
    this.productService.get('list').subscribe((sub) => {
      this.dataSourceProduct = new MatTableDataSource(sub);
      this.dataSourceProduct.paginator = this.paginator;
      this.dataSourceProduct.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUser.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceUser.paginator) {
      this.dataSourceUser.paginator.firstPage();
    }
  }
  addCant(product: ProductOrder) {
    product.product_cant++;
  }
  removeCant(product: ProductOrder) {
    product.product_cant--;
  }
  removeProduct(product: ProductOrder) {
    this.productsModel.splice(this.productsModel.indexOf(product), 1);
    this.dataSourceProductOrder = new MatTableDataSource(this.productsModel);
  }
  getTotalValues() {
    let total = 0;
    for (let index = 0; index < this.productsModel.length; index++) {
      total +=
        this.productsModel[index].value *
        this.productsModel[index].product_cant;
    }
    return total;
  }
}
