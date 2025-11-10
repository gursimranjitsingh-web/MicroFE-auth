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

declare module 'authApp/eventBus' {
  export interface AuthEvent {
    type: 'LOGIN' | 'LOGOUT' | 'AUTH_STATE_CHANGE';
    payload?: any;
  }

  export interface CartEvent {
    type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'CLEAR_CART' | 'CART_STATE_CHANGE';
    payload?: any;
  }

  export type AppEvent = AuthEvent | CartEvent;

  export const eventBus: {
    emit: (event: AppEvent) => void;
    onAll: () => any;
    onAuth: () => any;
    onCart: () => any;
    login: (user: any) => void;
    logout: () => void;
    addToCart: (item: any) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
  };
}