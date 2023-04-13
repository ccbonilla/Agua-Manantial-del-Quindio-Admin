import { Component, OnInit } from '@angular/core';
import { Info } from 'src/app/models/info';
import { InfoService } from 'src/app/services/infoService/info.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  aboutUs: string = '';
  mision: string = '';
  vision: string = '';
  phone: string = '';
  email: string = '';
  description: string = '';

  constructor(private infoService: InfoService, private router: Router) {}

  ngOnInit(): void {
    this.getInfo();
  }

  getInfo() {
    this.infoService.get('get-info/1').subscribe((info) => {
      this.aboutUs = info.description;
      this.mision = info.mision;
      this.vision = info.vision;
      this.phone = info.phone;
      this.email = info.email;
    });
  }

  updateInfo() {
    const infoModel: Info = {
      mision: this.mision,
      vision: this.vision,
      phone: this.phone,
      email: this.email,
      description: this.aboutUs,
    };
    this.infoService.put('update/1', infoModel).subscribe((res) => {
      this.getInfo();
      this.router.navigate(['orders']);
    });
  }
}
