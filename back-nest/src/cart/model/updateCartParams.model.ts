import { CartItem } from './cartItem.model';

export interface UpdateCartParams {
  user_id: number;
  cartItems: CartItem[];
}
