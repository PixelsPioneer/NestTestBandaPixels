import { useEffect, useState } from 'react';

import { useCartContext } from '../context/cartContext';

const useCart = (id: number) => {
  const [isActive, setIsActive] = useState(false);
  const { updateCartCount } = useCartContext();

  useEffect(() => {
    const savedCartIds: number[] = JSON.parse(localStorage.getItem('isActive') || '[]');
    setIsActive(savedCartIds.includes(id));
  }, [id]);

  const updateCart = () => {
    const savedCartIds: number[] = JSON.parse(localStorage.getItem('isActive') || '[]');

    let updatedCartIds;
    if (savedCartIds.includes(id)) {
      updatedCartIds = savedCartIds.filter(itemId => itemId !== id);
      setIsActive(false);
    } else {
      updatedCartIds = [...savedCartIds, id];
      setIsActive(true);
    }

    localStorage.setItem('isActive', JSON.stringify(updatedCartIds));

    updateCartCount();
  };

  return { isActive, updateCart };
};

export default useCart;
