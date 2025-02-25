import { CartItem } from './cartItem.model';

export interface UpdateCartParams {
  userId: number;
  cartItems: CartItem[];
}
