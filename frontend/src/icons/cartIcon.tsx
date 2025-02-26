import React, { useCallback, useEffect, useState } from 'react';

import { DeleteSweep, ShoppingCart } from '@mui/icons-material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Avatar, Badge, Divider, IconButton, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';
import debounce from 'lodash.debounce';

import axiosInstance from '../axioInterceptors/TokenInterceptors';
import { apiEndpoints } from '../constants/constants';
import useToken from '../utils/useToken';
import styles from './cartIconWithDropDown.module.css';

const CartIconWithDropdown = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const accessToken = useToken();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const user_id = localStorage.getItem('user_id');

  const fetchCart = async () => {
    try {
      if (!accessToken) {
        console.error('Access token not found');
        return;
      }

      const cartResponse = await axiosInstance.get(apiEndpoints.carts.cart, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const cartData = cartResponse.data.items || [];
      const updatedCart = cartData.map((item: any) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.hasDiscount ? item.product.newPrice : item.product.price,
        newPrice: item.product.newPrice,
        type: item.product.type,
        profileImages: item.product.profileImages[0],
        source: item.product.source,
        rating: item.product.rating,
        quantity: item.quantity || 1,
        totalPrice: item.totalPrice || item.product.price * (item.quantity || 1),
      }));

      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [accessToken]);

  useEffect(() => {
    const handleStorageChange = () => fetchCart();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const debouncedUpdateCartInSQL = useCallback(
    debounce(async (cart: any[]) => {
      if (!user_id) return;

      const payload = {
        cartItems: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        user_id,
      };

      try {
        const response = await axiosInstance.post(apiEndpoints.carts.update, payload);
        if (response.status === 200) {
          console.log('SQL Cart table updated:', response.data);
        } else {
          console.error('Bad Request');
        }
      } catch (error) {
        console.error('Error updating SQL Cart table:', error);
      }
    }, 1000),
    [user_id],
  );

  useEffect(() => {
    const syncCartFromLocalStorage = () => {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(storedCart);
    };

    syncCartFromLocalStorage();

    const cartUpdatedHandler = () => syncCartFromLocalStorage();
    window.addEventListener('cartUpdated', cartUpdatedHandler);

    return () => {
      window.removeEventListener('cartUpdated', cartUpdatedHandler);
    };
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      debouncedUpdateCartInSQL(cartItems);
    }
  }, [cartItems, debouncedUpdateCartInSQL]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setCartItems(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity } : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      debouncedUpdateCartInSQL(updatedCart);
      return updatedCart;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    debouncedUpdateCartInSQL([]);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const totalPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0);
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={totalQuantity} color="error">
          <ShoppingCart className={styles.cartIcon} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <List className={styles.prooverList}>
          {cartItems.length > 0 ? (
            cartItems.map((item: any) => (
              <div key={item.id}>
                <ListItem className={styles.listItem}>
                  <Avatar src={item.profileImages} alt={item.title} className={styles.avatar} />
                  <ListItemText
                    primary={item.title}
                    secondary={`Price: ${item.price} x ${item.quantity} = ${item.totalPrice}`}
                  />
                  <IconButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</IconButton>
                  <Typography className={styles.numberProduct}>{item.quantity}</Typography>
                  <IconButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</IconButton>
                  <IconButton onClick={() => handleRemoveItem(item.id)}>
                    <CloseOutlinedIcon className={styles.closeIcon} />
                  </IconButton>
                </ListItem>
                <Divider />
              </div>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Cart is empty" />
            </ListItem>
          )}

          <ListItem className={styles.listItemTotal}>
            <Typography variant="h6">Total Price</Typography>
            <Typography variant="h6" className={styles.totalPriceValue}>
              {totalPrice} UAH
            </Typography>
          </ListItem>

          <ListItem>
            <IconButton onClick={handleClearCart}>
              <DeleteSweep className={styles.clearCartIcon} />
            </IconButton>
            <ListItemText primary="Clear All" />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

export default CartIconWithDropdown;
