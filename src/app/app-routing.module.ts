import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { OrdersComponent } from './views/orders/orders.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProductsComponent } from './views/products/products.component';
import { CustomersComponent } from './views/customers/customers.component';
import { ReportsComponent } from './views/reports/reports.component';
import { InfoComponent } from './views/info/info.component';
import { CreateOrderComponent } from './views/orders/modal/create-order/create-order.component';
import { OrderReviewComponent } from './views/orders/modal/order-review/order-review.component';
import { DetailOrderComponent } from './views/orders/detail-order/detail-order.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'info', component: InfoComponent },
  { path: 'createOrder/:customer_id', component: CreateOrderComponent },
  { path: 'reviewOrder/:order', component: DetailOrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
