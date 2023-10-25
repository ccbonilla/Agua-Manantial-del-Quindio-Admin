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

const LOAD_COMPONENT = Object.freeze({
  load: 1,
  configSecciones: 2,
  previsualizacionHome: 3,
});

@Component({
  selector: 'app-home-cliente',
  templateUrl: './home-cliente.component.html',
  styleUrls: ['./home-cliente.component.scss']
})
export class HomeClienteComponent {
  seccionSelected: Section= new Section();
  seccionFormGroup: FormGroup;
  cliente: User = new User();
  sectionList: Section [] = [];
  isPrevisualizarOpen = false;
  checked = false;
  tabNuevo = false;
  nextSeccion = 0;
  estadoComponente: number = LOAD_COMPONENT.configSecciones;

  backgroundImages: string[] = [
  ];

  
  get loadingComponent() {
    return this.estadoComponente === LOAD_COMPONENT.load;
  }
  get configComponent() {
    return this.estadoComponente === LOAD_COMPONENT.configSecciones;
  }
  get viewHomeClientes() {
    return this.estadoComponente === LOAD_COMPONENT.previsualizacionHome;
  }
  
  constructor(private sectionService: sectionService, private formBuilder: FormBuilder) {
    this.seccionFormGroup = this.formBuilder.group({
      titulo_seccion: [null],
      descripcion: [null],
      posicion: [null],
      image: [null],
      opacity: [null],
      visible: [null],
    });
  }

  getInfoSecciones() {
    this.sectionService.get('list').subscribe((res) => {
      console.log('get sections '+JSON.stringify(res));
      this.sectionList = res;
      this.sectionList.sort((a, b) => a.posicion - b.posicion);
      this.seccionSelected = this.sectionList[0];
      this.tabs = []; 
      this.sectionList.forEach((section: Section) => {
        console.log('IMAGE TO ADD '+section.image);
        this.backgroundImages.push('url('+section.image+')');
        this.tabs.push(''+section.posicion);
        this.nextSeccion = section.posicion + 1;
      });
      console.log('fianl background image '+JSON.stringify(this.backgroundImages));
      console.log('get sections 1 '+JSON.stringify(this.seccionSelected) );
      
      this.createForm();
    });
  }

  ngOnInit(): void {
    this.isPrevisualizarOpen = false;
    this.getInfoSecciones();
  }
  createForm() {
    this.seccionFormGroup.patchValue({
      titulo_seccion: this.seccionSelected.home_tittle,
      descripcion: this.seccionSelected.description,
      posicion: this.seccionSelected.posicion,
      image: this.seccionSelected.image,
      opacity: this.seccionSelected.opacity *100,
      visible: this.seccionSelected.visible,
      // Otros campos del formulario
    });
  }

  tabs = ['1']; //'1', '2', '3'
  selected = new FormControl(0);

  cargarImagen(): void {
    console.log('URL en cargar IMAGEN : '+this.seccionFormGroup.controls['image'].value);
    this.seccionSelected.image = this.seccionFormGroup.controls['image'].value;
  }

  reloadListaSecciones(cargar: Boolean, reloadTab: Boolean): void {
    console.log('on reload lista secciones after save '+this.selected.value);
    this.sectionService.get('list').subscribe((res) => {
      this.sectionList = res;
      this.sectionList.sort((a, b) => a.posicion - b.posicion);
      this.seccionSelected = res[this.selected.value ?? 0];
      this.tabs = []; 
      this.backgroundImages = [];
      this.sectionList.forEach((section: Section) => {
        console.log('IMAGE TO ADD '+section.image);
        this.backgroundImages.push('url('+section.image+')');
        this.tabs.push(''+section.posicion);
        //if(section.posicion == this.selected.value && cargar){
        //  this.cargarImagen();
        //}
      });
      if(reloadTab){
        this.onTabSelectionChange(this.selected.value ?? 0);
      }
    });
    if(cargar){
      this.cargarImagen();
    }
  }
  salirprevisualizarHome(): void {
    this.estadoComponente = LOAD_COMPONENT.configSecciones;
    console.log('entro previsualizar : '+this.isPrevisualizarOpen);
    this.isPrevisualizarOpen = !this.isPrevisualizarOpen;
  }

  previsualizarHome(): void {
    this.reloadListaSecciones(false, false);
    this.estadoComponente = LOAD_COMPONENT.previsualizacionHome;
    console.log('entro previsualizar : '+this.isPrevisualizarOpen);
    this.isPrevisualizarOpen = !this.isPrevisualizarOpen;
  }

  guardarSeccion(): void {
    var seccionUpdate = new Section;
    seccionUpdate = this.sectionList[this.selected.value ?? 0];
    seccionUpdate.home_tittle = this.seccionFormGroup.controls['titulo_seccion'].value;
    seccionUpdate.description = this.seccionFormGroup.controls['descripcion'].value;
    seccionUpdate.posicion = this.seccionFormGroup.controls['posicion'].value;
    seccionUpdate.image = this.seccionFormGroup.controls['image'].value;
    seccionUpdate.opacity = (this.seccionFormGroup.controls['opacity'].value)/100;
    seccionUpdate.visible = this.seccionFormGroup.controls['visible'].value;

    if(seccionUpdate.newSeccion == true){
      //crear seccion
      console.log('ENTRO CREAR SECCION : '+seccionUpdate.newSeccion);
      console.log('SEc crear JSON : '+JSON.stringify(seccionUpdate));
      seccionUpdate.newSeccion = false;
      this.sectionService.create(`create`, seccionUpdate).subscribe((res) => {
        console.log('RESULT CREAR section '+JSON.stringify(res));
        this.mensajeUsuario('Sección creada correctamente');
        if (this.selected.value == 0) {
          window.location.reload();
        }
        this.selected.setValue(0);
        this.reloadListaSecciones(false, true);
      });
    } else {
      //update seccion
      console.log('ENTRO UPDATE SECCION : '+seccionUpdate.newSeccion);
      console.log('id de la seccion update : '+this.seccionSelected.section_id);
      
      
      console.log('SEc update : '+JSON.stringify(seccionUpdate));

      this.sectionService.put(`update/${this.seccionSelected.section_id}`, seccionUpdate).subscribe((res) => {
        console.log('RESULT UPDAte section '+JSON.stringify(res));
        this.mensajeUsuario('Sección actualizada correctamente');
        this.reloadListaSecciones(true, false);
      });
    }
    
  }
  onTabSelectionChange(selectedIndex: number) {
    this.selected.setValue(selectedIndex);
    this.seccionSelected = this.sectionList[selectedIndex];

    console.log('actual Selected Index : '+selectedIndex);
    console.log('comparacion tab nuevo : '+ this.tabNuevo);
    // Actualiza el valor del formulario con los datos de la sección seleccionada
    //this.seccionFormGroup.setValue(this.seccionSelected);
    if( this.tabNuevo){
      this.tabNuevo = false;
      
    } else {
      this.seccionFormGroup.patchValue({
        titulo_seccion: this.seccionSelected.home_tittle,
        descripcion: this.seccionSelected.description,
        posicion: this.seccionSelected.posicion,
        image: this.seccionSelected.image,
        opacity: this.seccionSelected.opacity * 100,
        visible: this.seccionSelected.visible,
      });
    }
    console.log('comparacion FIN tab nuevo : '+ this.tabNuevo);
    
  }

  addTab() {
    console.log('entro add tab : ');
    this.seccionFormGroup.patchValue({
      titulo_seccion: '',
      descripcion: '',
      posicion: this.nextSeccion,
      image: '',
      opacity: '',
      visible: '',
    });
    this.tabNuevo = true;
    this.seccionSelected = new Section();
    this.seccionSelected.image = 'https://photos.google.com/photo/AF1QipOgIfPL9lb_joiDS-77lFlvvTT8ziPnLQZVZMC0';
    this.seccionSelected.newSeccion = true;
    this.seccionSelected.visible = false;
    this.sectionList.push(this.seccionSelected);
    this.tabs.push('New');
    this.selected.setValue(this.tabs.length - 1);
  }
  removeTab(index: number) {
    console.log('entro eliminar tab : '+this.selected.value);
    if (this.selected.value === index && index != 0) {
      this.selected.setValue(index - 1);
    }
    
    // Elimina el tab del arreglo
    this.tabs.splice(index, 1);
    this.sectionList.splice(index, 1);
    if(this.seccionSelected.section_id != null){

      this.sectionService.del(`delete/${this.seccionSelected.section_id}`).subscribe((res) => {
        console.log('RESULT DELETE section '+JSON.stringify(res));
        this.mensajeUsuario('Sección borrada correctamente');
        if (index == 0) {
          window.location.reload();
        }
        this.reloadListaSecciones(true, true);
      });

    }
  }
  
  
  mensajeUsuario(msg: String) {
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
      title: msg,
    });
  }
}
