

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/products/product.service';

@Component({
  selector: 'app-dialog-config-chart',
  templateUrl: './dialog-config-chart.component.html',
  styleUrls: ['./dialog-config-chart.component.scss']
})
export class DialogConfigChartComponent implements OnInit {
  formGroup!: FormGroup;
  productModel: Product = new Product();

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private dialogRef: MatDialogRef<DialogConfigChartComponent>
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
    console.log('ACEPTAR')
  }
}
