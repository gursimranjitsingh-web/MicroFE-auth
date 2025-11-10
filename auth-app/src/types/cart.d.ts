import type { ComponentType } from 'react';

declare module 'cartApp/CartService' {
  interface CartServiceProps {
    children: React.ReactNode;
  }

  const CartService: ComponentType<CartServiceProps>;
}

declare module 'cartApp/hooks' {
  interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
  }

  interface CartState {
    items: Product[];
    totalCount: number;
  }

  export function useCart(): CartState;
  export function useCartActions(): {
    addItemToCart: (product: Product) => void;
    removeItemFromCart: (productId: number) => void;
    clearAllCart: () => void;
  };
}