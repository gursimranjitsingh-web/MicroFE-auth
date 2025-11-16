declare module 'authApp/CartProvider' {
  export const CartProvider: React.ComponentType;
  export const useCart: () => {
    cartItems: any[];
    addToCart: (item: any) => void;
    removeFromCart: (id: string) => void;
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

declare module 'ui/components' {
  import type { FC, ReactNode, MouseEvent } from 'react'

  interface ThemeProviderProps {
    children?: ReactNode
  }

  interface LookButtonProps {
    children?: ReactNode
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
    className?: string
    style?: React.CSSProperties
    type?: 'primary' | 'link' | 'text' | 'default' | 'dashed'
    loading?: boolean
    block?: boolean
    [key: string]: any
  }

  interface LookIconProps {
    [key: string]: any
  }

  interface SvgIconsProps {
    [key: string]: any
  }

  export const ThemeProvider: FC<ThemeProviderProps>
  export const LookButton: FC<LookButtonProps>
  export const LookIcon: FC<LookIconProps>
  export const SvgIcons: FC<SvgIconsProps>
}