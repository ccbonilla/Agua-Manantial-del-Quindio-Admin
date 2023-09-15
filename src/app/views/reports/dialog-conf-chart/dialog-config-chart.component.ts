import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-config-chart',
  templateUrl: './dialog-config-chart.component.html',
  styleUrls: ['./dialog-config-chart.component.scss']
})
export class DialogConfigChartComponent implements OnInit {
  formGroup!: FormGroup;
  selected: Date | null = new Date;
  startDate = new Date();
  checkBoxValid = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dialogRef: MatDialogRef<DialogConfigChartComponent>,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.formGroup = this.formBuilder.group({
      fechaInicial: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      pedido: [false],
      cliente: [false],
      fecha: [true],
    });
  }

  checkboxChanged(checkboxName: string) {

    const { pedido, cliente, fecha } = this.formGroup.value;

      if (pedido || cliente || fecha) {
        this.checkBoxValid = true;
        console.log('un checkbox seleccionado '+this.checkBoxValid);
      } else {
        this.checkBoxValid = false;
      }
  }

  createOrder() {
    console.log('enter submit ' );
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
      console.log('Formulario válido');
    } else {
      console.log('Formulario no válido');
    }
  }
}
