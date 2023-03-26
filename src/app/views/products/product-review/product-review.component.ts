import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/products/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-review',
  templateUrl: './product-review.component.html',
  styleUrls: ['./product-review.component.scss'],
})
export class ProductReviewComponent {
  formGroup!: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });
  }
  updateOrder() {
    this.productService
      .put(`update/${this.data.product_id}`, this.data)
      .subscribe((res) => {
        console.log('ok');
      });
  }
}
