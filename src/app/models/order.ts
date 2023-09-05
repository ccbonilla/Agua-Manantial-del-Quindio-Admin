import { User } from './user';
import { ProductOrder } from './product_order';
export class Order {
  order_id: number = 0;
  user_id: number = 0;
  order_date: string = '';
  order_state: number = 0;
  value: number = 0;
  discount: number = 0;
  payment_type_id: number = 0;
  customer: User = {
    user_id: 0,
    name: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    user_type_id: 0,
    previous_user_type_id: 0,
    count: 0,
    user_type_name: '',
  };
  products: ProductOrder[] = [];
}
