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
import { User } from 'src/app/models/user';
import { userType } from 'src/app/models/user_type';
import { UserService } from 'src/app/services/users/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-review',
  templateUrl: './customer-review.component.html',
  styleUrls: ['./customer-review.component.scss'],
})
export class CustomerReviewComponent implements OnInit {
  customerFormGroup!: FormGroup;
  formData = new FormData();
  userTypesList: userType[] = [];
  @ViewChild('inputFieldAddress')
  private inputFieldAddress!: ElementRef;
  autocompleteAddress: google.maps.places.Autocomplete | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public user: User
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
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      address_detail: [null, [Validators.required]],
      user_type: [null, [Validators.required]],
      identification: [null, [Validators.required]],
      ticket: [null, [Validators.required]],
    });
  }
  updateUser() {
    this.userService
      .updateUser(`update/${this.user.user_id}`, this.user)
      .subscribe((sub) => {
        Swal.fire({
          title: `Usuario Actualizado correctamente`,
          icon: 'success',
          confirmButtonText: 'Enviar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
        }).then((response) => {
          if (response.isConfirmed) {
            this.router.navigate(['customers']);
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
