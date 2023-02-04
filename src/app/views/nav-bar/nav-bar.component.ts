import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public logged: boolean;
  constructor(
    private router: Router,
    private localStorageService: LocalstorageService<any>
  ) {
    console.log('constructor');
    this.localStorageService.setItem('logged', false);
    this.logged = this.localStorageService.getItem('logged');
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  logOut() {
    this.localStorageService.setItem('logged', false);
    this.router.navigate(['']);
  }
}
