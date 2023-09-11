import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/orders/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss'],
})
export class OrderReviewComponent implements OnInit {
  formGroup!: FormGroup;
  state_options: any[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      date: [null, [Validators.required]],
      nameCustomer: [null, [Validators.required]],
      lastNameCustomer: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      cant: [null, [Validators.required]],
      state: [null, [Validators.required]],
    });
    this.getStates();
  }
  updateOrder() {
    this.orderService
      .put(`update/${this.data.order_id}`, this.data)
      .subscribe((res) => {
        console.log('ok');
      });
  }

  getStates() {
    this.orderService.getStates('list-order-states').subscribe((res) => {
      this.state_options = res;
    });
  }
}
