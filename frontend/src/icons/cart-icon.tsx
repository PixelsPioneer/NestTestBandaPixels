import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { IconButton } from '@mui/material';

import useCart from '../hooks/useCart';
import styles from './cartIconProductCard.module.css';

interface CartIconProps {
  id: number;
}

const CartIcon: React.FC<CartIconProps> = ({ id }) => {
  const { isActive, updateCart } = useCart(id);

  return (
    <IconButton onClick={updateCart}>
      <ShoppingCartOutlinedIcon className={`${styles.cartButton} ${isActive ? styles.activeCartButton : ''}`} />
    </IconButton>
  );
};

export default CartIcon;
