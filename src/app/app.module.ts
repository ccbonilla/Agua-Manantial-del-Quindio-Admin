import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NgChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { OrdersComponent } from './views/orders/orders.component';
import { NavBarComponent } from './views/nav-bar/nav-bar.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProductsComponent } from './views/products/products.component';
import { CustomersComponent } from './views/customers/customers.component';
import { ReportsComponent } from './views/reports/reports.component';
import { InfoComponent } from './views/info/info.component';
import { ProductService } from './services/products/product.service';
import { OrderService } from './services/orders/orders.service';
import { UserService } from './services/users/users.service';
import { OrderReviewComponent } from './views/orders/modal/order-review/order-review.component';
import { ProductReviewComponent } from './views/products/product-review/product-review.component';
import { InfoService } from './services/infoService/info.service';
import { UserTypeComponent } from './views/user-type/user-type.component';
import { CreateOrderComponent } from './views/orders/modal/create-order/create-order.component';
import { CreateProductComponent } from './views/products/create-product/create-product.component';
import { CreateCustomerComponent } from './views/customers/create-customer/create-customer.component';
import { CustomerReviewComponent } from './views/customers/customer-review/customer-review.component';
import { DetailOrderComponent } from './views/orders/detail-order/detail-order.component';
import { DialogConfigChartComponent } from './views/reports/dialog-conf-chart/dialog-config-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    OrdersComponent,
    NavBarComponent,
    DashboardComponent,
    ProductsComponent,
    CustomersComponent,
    ReportsComponent,
    InfoComponent,
    OrderReviewComponent,
    ProductReviewComponent,
    UserTypeComponent,
    CreateOrderComponent,
    CreateProductComponent,
    CreateCustomerComponent,
    CustomerReviewComponent,
    DetailOrderComponent,
    DialogConfigChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    ModalModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    FormsModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDividerModule,
    FlexLayoutModule,
    NgChartsModule,
  ],
  providers: [
    ProductService,
    OrderService,
    UserService,
    BsModalService,
    InfoService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
