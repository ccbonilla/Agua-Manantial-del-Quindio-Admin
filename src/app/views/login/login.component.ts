import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/users/users.service';
import { LocalStorageService } from 'angular-web-storage';

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
    private localStorage: LocalStorageService,
    public userService: UserService
  ) {}
  logIn() {
    const { email, password } = this.miFormulario.value;
    this.userService
      .login(email as string, password as string)
      .subscribe((res) => {
        if (res.user_id != 0) {
          this.localStorage.set('logged', JSON.stringify(res));
          this.router.navigate(['orders']);
        }
      });
  }
}
