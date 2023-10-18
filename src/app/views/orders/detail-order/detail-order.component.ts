import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/models/order';
import { MatTableDataSource } from '@angular/material/table';
import { OrderService } from 'src/app/services/orders/orders.service';
import { UserService } from 'src/app/services/users/users.service';
import { ProductOrder } from 'src/app/models/product_order';
import { OrderState } from 'src/app/models/order_state';
import { userType } from 'src/app/models/user_type';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss'],
})
export class DetailOrderComponent implements OnInit {
  dataSource: MatTableDataSource<ProductOrder>;
  titles: string[] = ['id', 'name', 'cant'];
  customerFormGroup!: FormGroup;
  orderFormGroup!: FormGroup;
  formData = new FormData();
  orderStateslist: OrderState[] = [];
  userTypesList: userType[] = [];
  @ViewChild('inputFieldAddress')
  private inputFieldAddress!: ElementRef;
  autocompleteAddress: google.maps.places.Autocomplete | undefined;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public order: Order
  ) {
    this.dataSource = new MatTableDataSource(this.order.products);
  }

  ngOnInit(): void {
    this.getOrderStates();
    this.getUserTypes();
    this.createForm();
  }
  ngAfterViewInit() {
    this.autocompleteAddress = new google.maps.places.Autocomplete(
      this.inputFieldAddress.nativeElement
    );
    this.autocompleteAddress?.addListener('place_changed', () => {
      this.order.customer.address = this.inputFieldAddress.nativeElement.value;

      this.order.customer.lat = this.autocompleteAddress
        ?.getPlace()
        .geometry?.location?.lat();
      this.order.customer.lon = this.autocompleteAddress
        ?.getPlace()
        .geometry?.location?.lng();
    });
  }
  createForm() {
    this.customerFormGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      address_detail: [null, [Validators.required]],
      user_type: [null, [Validators.required]],
      ticket: [null, [Validators.required]],
    });
    this.orderFormGroup = this.formBuilder.group({
      order_date: [null, [Validators.required]],
      value: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      state: [null, [Validators.required]],
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
  getOrderStates() {
    this.orderService.getStates('list-order-states').subscribe((sub) => {
      this.orderStateslist = sub;
    });
  }
  getUserTypes() {
    this.userService.getUserTypes('list').subscribe((sub) => {
      this.userTypesList = sub;
    });
  }
}
