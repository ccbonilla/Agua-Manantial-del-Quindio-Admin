import { Component, OnInit, Inject } from '@angular/core';
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
export class CreateCustomerComponent {
  customerFormGroup!: FormGroup;
  formData = new FormData();
  userTypesList: userType[] = [];
  user: User = new User();

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getUserTypes();
    this.createForm();
  }
  createForm() {
    this.customerFormGroup = this.formBuilder.group({
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      user_type: [null, [Validators.required]],
      identification: [null, [Validators.required]],
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
