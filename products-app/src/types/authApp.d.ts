declare module 'authApp/AuthProvider' {
  export const AuthProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useAuth: () => {
    token: string | null;
    userData: {
      name: string;
      role: string;
      permissions: string[];
      theme: string;
    } | null;
    login: () => void;
    logout: () => void;
    updateUserData: (name: string) => void;
  };
}

declare module 'authApp/CartProvider' {
  export const CartProvider: React.ComponentType<{ children: React.ReactNode }>;
  export const useCart: () => {
    cartItems: Array<{
      id: number;
      title: string;
      price: number;
      image: string;
    }>;
    addToCart: (product: {
      id: number;
      title: string;
      price: number;
      image: string;
    }) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
  };
}