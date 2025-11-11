import { eventBus } from '../eventBus';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

class CartService {
  private cartItems: Product[] = [];
  private isProcessing = false;

  constructor() {
    // Subscribe to cart events from other MFs
    eventBus.onCart().subscribe((event: any) => {
      switch (event.type) {
        case 'ADD_TO_CART':
          // Don't process if this is a broadcast from us
          if (!this.isProcessing) {
            this.addToCart(event.payload);
          }
          break;
        case 'REMOVE_FROM_CART':
          if (!this.isProcessing) {
            this.removeFromCart(event.payload);
          }
          break;
        case 'CLEAR_CART':
          if (!this.isProcessing) {
            this.clearCart();
          }
          break;
        case 'CART_STATE_CHANGE':
          if (event.payload === 'REQUEST_STATE') {
            // Respond with current cart state
            console.log('📤 Sending cart state:', this.cartItems.length, 'items');
            this.broadcastCartState();
          }
          break;
      }
    });

    // Emit initial empty cart state after a short delay
    // setTimeout(() => {
      console.log('🎬 Initial cart state broadcast: empty');
      this.broadcastCartState();
    // }, 100);
  }

  private addToCart(product: Product): void {
    const existing = this.cartItems.find(item => item.id === product.id);
    if (!existing) {
      console.log('➕ Adding to cart:', product.title);
      this.cartItems = [...this.cartItems, product];
      this.isProcessing = true;
      this.broadcastCartState();
      this.isProcessing = false;
    } else {
      console.log('⚠️ Item already in cart:', product.title);
    }
  }

  private removeFromCart(productId: number): void {
    console.log('➖ Removing from cart:', productId);
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    this.isProcessing = true;
    this.broadcastCartState();
    this.isProcessing = false;
  }

  private clearCart(): void {
    console.log('🗑️ Clearing cart');
    this.cartItems = [];
    this.isProcessing = true;
    this.broadcastCartState();
    this.isProcessing = false;
  }

  private broadcastCartState(): void {
    // Broadcast the current cart state to all subscribers
    console.log('📢 Broadcasting cart state:', this.cartItems.length, 'items');
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
