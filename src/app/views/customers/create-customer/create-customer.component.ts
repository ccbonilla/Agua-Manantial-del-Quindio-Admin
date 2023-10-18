import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { userType } from 'src/app/models/user_type';
import { UserService } from 'src/app/services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss'],
})
export class CreateCustomerComponent implements OnInit {
  customerFormGroup!: FormGroup;
  formData = new FormData();
  userTypesList: userType[] = [];
  user: User = new User();
  @ViewChild('inputFieldAddress')
  private inputFieldAddress!: ElementRef;
  autocompleteAddress: google.maps.places.Autocomplete | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getUserTypes();
    this.createForm();
  }

  ngAfterViewInit() {
    this.autocompleteAddress = new google.maps.places.Autocomplete(
      this.inputFieldAddress.nativeElement
    );
    this.autocompleteAddress?.addListener('place_changed', () => {
      this.user.address = this.inputFieldAddress.nativeElement.value;

      this.user.lat = this.autocompleteAddress
        ?.getPlace()
        .geometry?.location?.lat();
      this.user.lon = this.autocompleteAddress
        ?.getPlace()
        .geometry?.location?.lng();
    });
  }
  createForm() {
    this.customerFormGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      address_detail: [null, [Validators.required]],
      user_type: [null, [Validators.required]],
      identification: [null, [Validators.required]],
      ticket: [null, [Validators.required]],
    });
  }
  createUser() {
    this.userService.createUser('create', this.user).subscribe((sub) => {
      Swal.fire({
        title: `Usuario creado correctamente`,
        icon: 'success',
        confirmButtonText: 'Enviar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
      }).then((response) => {
        if (response.isConfirmed) {
          this.router.navigate(['/customers']);
        }
      });
    });
  }
  getUserTypes() {
    this.userService.getUserTypes('list').subscribe((sub) => {
      this.userTypesList = sub;
    });
  }
}
