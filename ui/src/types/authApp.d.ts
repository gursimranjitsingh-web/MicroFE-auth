declare module 'authApp/eventBus' {
  export interface AuthEvent {
    type: 'LOGIN' | 'LOGOUT' | 'AUTH_STATE_CHANGE'
    payload?: any
  }

  export interface CartEvent {
    type:
      | 'ADD_TO_CART'
      | 'REMOVE_FROM_CART'
      | 'CLEAR_CART'
      | 'CART_STATE_CHANGE'
    payload?: any
  }

  export type AppEvent = AuthEvent | CartEvent

  export const eventBus: {
    emit: (event: AppEvent) => void
    onAll: () => any
    onAuth: () => any
    onCart: () => any
    login: (user: any) => void
    logout: () => void
    addToCart: (item: any) => void
    removeFromCart: (itemId: string) => void
    clearCart: () => void
  }
}
