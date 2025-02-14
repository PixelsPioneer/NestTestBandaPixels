import { createContext, useContext, useEffect, useState } from 'react';

interface CartContextProps {
  cartCount: number;
  updateCartCount: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const savedCartIds: number[] = JSON.parse(localStorage.getItem('isActive') || '[]');
    setCartCount(savedCartIds.length);
  }, []);

  const updateCartCount = () => {
    const savedCartIds: number[] = JSON.parse(localStorage.getItem('isActive') || '[]');
    setCartCount(savedCartIds.length);
  };

  return <CartContext.Provider value={{ cartCount, updateCartCount }}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
