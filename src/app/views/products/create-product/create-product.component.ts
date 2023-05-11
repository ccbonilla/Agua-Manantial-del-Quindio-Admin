import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/products/product.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  formGroup!: FormGroup;
  productModel: Product = new Product();

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private dialogRef: MatDialogRef<CreateProductComponent>
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

  createOrder() {
    this.productService.create('create', this.productModel).subscribe((res) => {
      console.log(res);
      this.dialogRef.close();
      this.router.navigate(['products']);
    });
  }
}
