import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { IconButton } from '@mui/material';

import useCart from '../hooks/useCart';

interface CartIconProps {
  id: number;
}

const CartIcon: React.FC<CartIconProps> = ({ id }) => {
  const { isActive, updateCart } = useCart(id);

  return (
    <IconButton
      onClick={updateCart}
      sx={{
        color: isActive ? 'green' : 'var(--cart-color)',
        border: 'none',
        transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.1)',
        },
        '&:active': {
          color: 'green',
          transform: 'scale(0.95)',
        },
      }}>
      <ShoppingCartOutlinedIcon sx={{ fontSize: '22px', color: isActive ? 'green' : 'var(--cart-color)' }} />
    </IconButton>
  );
};

export default CartIcon;
