import { Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef, } from '@angular/core';
import { User } from 'src/app/models/user';
import Swal from 'sweetalert2';
import { sectionService } from 'src/app/services/sectionService/section.service';
import { Section } from 'src/app/models/section';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss']
})
export class HomeClienteComponent {
  seccionSelected: Section= new Section();
  seccionFormGroup!: FormGroup;
  cliente: User = new User();
  sectionList: Section [] = [];

  backgroundImages: string[] = [
  ];

  constructor(private sectionService: sectionService, private formBuilder: FormBuilder) {}

  getInfoSecciones() {
    this.sectionService.get('list').subscribe((res) => {
      console.log('get sections '+JSON.stringify(res));
      this.seccionSelected = res[0];
      this.sectionList = res;
      this.sectionList.sort((a, b) => a.posicion - b.posicion);
      this.sectionList.forEach((section: Section) => {
        console.log('IMAGE TO ADD '+section.image);
        this.backgroundImages.push('url('+section.image+')');
      });
      console.log('fianl background image '+JSON.stringify(this.backgroundImages));
      console.log('get sections 1 '+JSON.stringify(this.seccionSelected) );
    });
  }

  ngOnInit(): void {
    this.getInfoSecciones();
    this.createForm()
  }
  createForm() {
    this.seccionFormGroup = this.formBuilder.group({
      order_date: [null, [Validators.required]],
      value: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      state: [null, [Validators.required]],
      products: [null, [Validators.required]],
    });
  }
  
  logout() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Ya puedes iniciar tu pedido',
    });
  }

  tabs = ['1', '2', '3'];
  selected = new FormControl(0);

  addTab() {
    this.tabs.push('New');
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
