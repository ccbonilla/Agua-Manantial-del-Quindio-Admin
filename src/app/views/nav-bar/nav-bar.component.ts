import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { UserService } from 'src/app/services/users/users.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TicketHolderComponent } from '../orders/ticket-holder/ticket-holder.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public logged: boolean = false;
  constructor(
    private router: Router,
    private localStorageService: LocalstorageService,
    public userService: UserService,
    private dialog : MatDialog
  ) {}

  ngOnInit(): void {}

  logOut() {
    this.localStorageService.setItem('logged', false);
    this.router.navigate(['']);
  }

  updatePassword() {
    const user = this.localStorageService.getItem('logged');

    Swal.fire({
      title: `Hola ${user.name} digite la nueva contraseña`,
      input: 'text',
      icon: 'info',
      confirmButtonText: 'Aceptar',
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.userService.updatePassword(`update/${user.email}`, {
          password: res.value,
        });
      }
    });
  }

  openDialog(){
    this.dialog.open(TicketHolderComponent)
  }
}
