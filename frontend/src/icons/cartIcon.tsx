import React, { useEffect, useState } from 'react';

import { DeleteSweep, ShoppingCart } from '@mui/icons-material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Avatar, Badge, Divider, IconButton, List, ListItem, ListItemText, Popover, Typography } from '@mui/material';

import styles from './cartIconWithDropDown.module.css';

const CartIconWithDropdown = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const fetchCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');

    const updatedCart = savedCart.map((item: any) => ({
      ...item,
      quantity: item.quantity || 1,
      totalPrice: item.totalPrice || item.price,
    }));

    setCartItems(updatedCart);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => fetchCart();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchCart();
    });

    return () => clearInterval(interval);
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) return;

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity } : item,
    );

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleRemoveItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    const isActive = JSON.parse(localStorage.getItem('isActive') || '[]');
    const updatedIsActive = isActive.filter((itemId: number) => itemId !== Number(id));
    localStorage.setItem('isActive', JSON.stringify(updatedIsActive));
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    window.dispatchEvent(new Event('storage'));
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
                  <Avatar src={item.image} alt={item.title} className={styles.avatar} />
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
