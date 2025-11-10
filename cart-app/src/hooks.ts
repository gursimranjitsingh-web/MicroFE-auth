import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from './store/cartServiceSlice';
import type { RootState, AppDispatch } from './store';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

// Hook to get cart state
export const useCart = () => {
  const cart = useSelector((state: RootState) => state.cartService);
  return cart;
};

// Hook to get cart actions
export const useCartActions = () => {
  const dispatch = useDispatch<AppDispatch>();

  const addItemToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const removeItemFromCart = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const clearAllCart = () => {
    dispatch(clearCart());
  };

  return {
    addItemToCart,
    removeItemFromCart,
    clearAllCart,
  };
};