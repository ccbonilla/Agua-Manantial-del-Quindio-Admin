import { Component, OnInit } from '@angular/core';
import { Info } from 'src/app/models/info';
import { InfoService } from 'src/app/services/infoService/info.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  formGroup!: FormGroup;
  formData = new FormData();
  info: Info = new Info();

  constructor(
    private infoService: InfoService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getInfo();
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      description: [null, [Validators.required]],
      mision: [null, [Validators.required]],
      vision: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
    });
  }

  getInfo() {
    this.infoService.get('get-info/1').subscribe((info) => {
      console.log('info', info);

      this.info = info;
    });
  }

  updateInfo() {
    this.infoService.put('update/1', this.info).subscribe((res) => {
      this.getInfo();
      this.router.navigate(['orders']);
    });
  }
}
