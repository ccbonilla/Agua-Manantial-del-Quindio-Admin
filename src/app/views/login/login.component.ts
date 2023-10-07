import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users/users.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  alert = false;
  miFormulario = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private localStorage: LocalstorageService,
    public userService: UserService
  ) {}
  logIn() {
    const { email, password } = this.miFormulario.value;
    this.userService
      .login(email as string, password as string)
      .subscribe((res) => {
        if (res.user_id != 0 && res != 'Usuario o contraseña incorrecto') {
          Swal.fire('Bienvenido', res.name, 'success');
          this.localStorage.setItem('logged', res);
          this.router.navigate(['orders']);
        } else {
          Swal.fire(res, 'Por favor, revise sus credenciales', 'warning');
        }
      });
  }

  resetPassword() {
    const { email } = this.miFormulario.value;
    Swal.fire({
      title: `Se enviará una nueva contraseña al correo: ${email}`,
      input: 'text',
      inputPlaceholder: `${email}`,
      icon: 'info',
      confirmButtonText: 'Aceptar',
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.userService.resetPassword(`reset-password/${res.value}`);
      }
    });
  }
}
