import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { OrderService } from 'src/app/services/orders/orders.service';
import { UserService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  @ViewChild('placesRef') placesRef: GooglePlaceDirective | undefined;
  options = {
    types: [],
  };
  zoom = 11;
  title_add = '';
  longitude = 0;
  latitude = 0;
  initBound = '';
  finalBound = '';
  textBounds = false;
  coordenates: any[] = [
    // {
    //   lat: 4.5349285711228715,
    //   lng: -75.69876194000244,
    //   address: 'Agua Manantial Del Quindío',
    // },
  ];

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getCoordenates();
  }
  center: google.maps.LatLngLiteral = {
    lat: 4.5349285711228715,
    lng: -75.69876194000244,
  };
  markerPositions: any[] = [,];

  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    label: {
      color: 'red',
      text: 'Punto de entrega',
    },
    animation: google.maps.Animation.BOUNCE,
    icon: {
      url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      scaledSize: new google.maps.Size(40, 40),
    },
  };

  getCoordenates() {
    this.orderService.get('list').subscribe((res) => {
      const orders = res.filter((or) => or.order_state == 2);

      for (let order of orders) {
        const { user_id } = order;
        const user: User = new User();
        this.userService
          .getUserById(`find-by-id/${user_id}`)
          .subscribe((user) => {
            const { lat, lon, address, address_detail } = user;
            this.coordenates.push({
              lat,
              lng: lon,
              address,
              address_detail,
            });
            this.markerPositions.push({
              lat,
              lng: lon,
            });
          });
      }
    });
  }
}
