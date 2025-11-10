declare module 'authApp/CartProvider' {
  export const CartProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useCart: () => {
    cartItems: Array<{
      id: number;
      title: string;
      price: number;
      image: string;
    }>;
    addToCart: (product: { id: number; title: string; price: number; image: string }) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
  };
}