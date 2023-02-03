import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/services/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private localStorageService: LocalstorageService<any>
  ) {}

  ngOnInit(): void {}

  login() {
    this.router.navigate(['dashboard']);
  }
}
