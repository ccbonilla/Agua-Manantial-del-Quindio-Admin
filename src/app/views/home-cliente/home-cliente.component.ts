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
      this.seccionSelected = res[0];
      this.tabs = []; 
      this.sectionList.forEach((section: Section) => {
        console.log('IMAGE TO ADD '+section.image);
        this.backgroundImages.push('url('+section.image+')');
        this.tabs.push(''+section.posicion);
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
    //this.seccionFormGroup = this.formBuilder.group({
    //  titulo_seccion: [null],
    //  //posicion: [null],
    //  //descripcion: [null],
    //  //seccion_id: [null],
    //});
    this.seccionFormGroup.patchValue({
      titulo_seccion: this.seccionSelected.home_tittle,
      descripcion: this.seccionSelected.description,
      posicion: this.seccionSelected.posicion,
      image: this.seccionSelected.image,
      opacity: this.seccionSelected.opacity,
      visible: this.seccionSelected.visible,
      // Otros campos del formulario
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

  tabs = ['1']; //'1', '2', '3'
  selected = new FormControl(0);

  cargarImagen(): void {
    console.log('URL en cargar IMAGEN : '+this.seccionFormGroup.controls['image'].value);
    this.seccionSelected.image = this.seccionFormGroup.controls['image'].value;
  }

  reloadListaSecciones(cargar: Boolean): void {
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
      });
    });
    if(cargar){
      this.cargarImagen();
    }
  }

  guardarSeccion(): void {
    var seccionUpdate = new Section();
    seccionUpdate = this.sectionList[this.selected.value ?? 0];
    console.log('id de la seccion update : '+this.seccionSelected.section_id);
    seccionUpdate.home_tittle = this.seccionFormGroup.controls['titulo_seccion'].value;
    seccionUpdate.description = this.seccionFormGroup.controls['descripcion'].value;
    seccionUpdate.posicion = this.seccionFormGroup.controls['posicion'].value;
    seccionUpdate.image = this.seccionFormGroup.controls['image'].value;
    seccionUpdate.opacity = this.seccionFormGroup.controls['opacity'].value;
    seccionUpdate.visible = this.seccionFormGroup.controls['visible'].value;
    
    console.log('SEc update : '+JSON.stringify(seccionUpdate));

    this.sectionService.put(`update/${this.seccionSelected.section_id}`, seccionUpdate).subscribe((res) => {
      console.log('RESULT UPDAte section '+JSON.stringify(res));
      this.reloadListaSecciones(true);
    });
    
  }
  salirprevisualizarHome(): void {
    this.estadoComponente = LOAD_COMPONENT.configSecciones;
    console.log('entro previsualizar : '+this.isPrevisualizarOpen);
    this.isPrevisualizarOpen = !this.isPrevisualizarOpen;
  }

  previsualizarHome(): void {
    this.reloadListaSecciones(false);
    this.estadoComponente = LOAD_COMPONENT.previsualizacionHome;
    console.log('entro previsualizar : '+this.isPrevisualizarOpen);
    this.isPrevisualizarOpen = !this.isPrevisualizarOpen;
  }
  onTabSelectionChange(selectedIndex: number) {
    this.selected.setValue(selectedIndex);
    this.seccionSelected = this.sectionList[selectedIndex];

    console.log('actual Selected Index : '+selectedIndex);
    console.log('comparacion tab nuevo : '+ this.tabNuevo);
    // Actualiza el valor del formulario con los datos de la sección seleccionada
    //this.seccionFormGroup.setValue(this.seccionSelected);
    if( !(this.tabNuevo)){
      this.seccionFormGroup.patchValue({
        titulo_seccion: this.seccionSelected.home_tittle,
        descripcion: this.seccionSelected.description,
        posicion: this.seccionSelected.posicion,
        image: this.seccionSelected.image,
        opacity: this.seccionSelected.opacity,
        visible: this.seccionSelected.visible,
      });
    } else {

      this.tabNuevo = false;
    }
    console.log('comparacion FIN tab nuevo : '+ this.tabNuevo);
    
  }

  addTab() {
    console.log('entro add tab : ');
    this.seccionFormGroup.patchValue({
      titulo_seccion: '',
      descripcion: '',
      posicion: '',
      image: '',
      opacity: '',
      visible: '',
    });
    this.tabNuevo = true;
    this.seccionSelected = new Section();
    this.seccionSelected.image = 'https://picsum.photos/id/431/900/500';
    this.seccionSelected.newSeccion = true;
    this.sectionList.push(this.seccionSelected);
    this.tabs.push('New');
    this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}
