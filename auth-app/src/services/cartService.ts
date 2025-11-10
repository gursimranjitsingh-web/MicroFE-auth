import { eventBus } from '../eventBus';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

class CartService {
  private cartItems: Product[] = [];

  constructor() {
    // Subscribe to cart events from other MFs
    eventBus.onCart().subscribe((event: any) => {
      switch (event.type) {
        case 'ADD_TO_CART':
          this.addToCart(event.payload);
          break;
        case 'REMOVE_FROM_CART':
          this.removeFromCart(event.payload);
          break;
        case 'CLEAR_CART':
          this.clearCart();
          break;
        case 'CART_STATE_CHANGE':
          if (event.payload === 'REQUEST_STATE') {
            // Respond with current cart state
            this.broadcastCartState();
          }
          break;
      }
    });
  }

  private addToCart(product: Product): void {
    const existing = this.cartItems.find(item => item.id === product.id);
    if (!existing) {
      this.cartItems = [...this.cartItems, product];
      this.broadcastCartState();
    }
  }

  private removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.broadcastCartState();
  }

  private clearCart(): void {
    this.cartItems = [];
    this.broadcastCartState();
  }

  private broadcastCartState(): void {
    // Broadcast the current cart state to all subscribers
    eventBus.emit({
      type: 'CART_STATE_CHANGE',
      payload: [...this.cartItems]
    });
  }

  public getCartItems(): Product[] {
    return [...this.cartItems];
  }
}

// Create singleton instance
export const cartService = new CartService();
