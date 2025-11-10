/**
 * DEPRECATED - This file is no longer used
 * 
 * The application now uses event-driven communication via EventBus (RxJS)
 * instead of Context API for sharing cart state between micro-frontends.
 * 
 * See:
 * - src/eventBus/index.ts - Event bus implementation
 * - src/services/cartService.ts - Cart state management with events
 * 
 * This file is kept for reference only.
 */

import React, { createContext, useContext, useState } from 'react';
import { eventBus } from '../eventBus';
import type { ReactNode } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (!existing) {
        eventBus.emit({ type: 'ADD_TO_CART', payload: product });
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => {
      eventBus.emit({ type: 'REMOVE_FROM_CART', payload: productId });
      return prev.filter(item => item.id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    eventBus.emit({ type: 'CLEAR_CART' });
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};