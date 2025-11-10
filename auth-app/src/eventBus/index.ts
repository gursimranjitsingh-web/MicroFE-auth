import { Subject, Observable, filter, map } from 'rxjs';

/**
 * Event Types for Authentication
 * - LOGIN: Emitted when user successfully logs in
 * - LOGOUT: Emitted when user logs out
 * - AUTH_STATE_CHANGE: Emitted when auth state changes or when requested by other MFs
 */
export interface AuthEvent {
  type: 'LOGIN' | 'LOGOUT' | 'AUTH_STATE_CHANGE';
  payload?: any;
}

/**
 * Event Types for Cart Operations
 * - ADD_TO_CART: Emitted when an item is added to cart
 * - REMOVE_FROM_CART: Emitted when an item is removed from cart
 * - CLEAR_CART: Emitted when cart is cleared
 * - CART_STATE_CHANGE: Emitted when cart state changes or when requested by other MFs
 */
export interface CartEvent {
  type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'CLEAR_CART' | 'CART_STATE_CHANGE';
  payload?: any;
}

// Union type of all possible events
export type AppEvent = AuthEvent | CartEvent;

/**
 * EventBus - Global communication hub for all micro-frontends
 * 
 * This class uses RxJS Subject to enable pub/sub pattern across independent MFs.
 * Each MF can emit events or subscribe to specific event types without knowing
 * about other MFs' internal implementation.
 * 
 * Benefits:
 * - Complete decoupling of micro-frontends
 * - No shared state or context dependencies
 * - Each MF maintains its own local state
 * - Communication only through events
 */
class EventBus {
  // Private RxJS Subject - the core event stream
  private eventSubject = new Subject<AppEvent>();

  /**
   * Emit an event to all subscribers
   * @param event - The event object containing type and optional payload
   * 
   * Example:
   * eventBus.emit({ type: 'ADD_TO_CART', payload: product });
   */
  emit(event: AppEvent): void {
    console.log('🚀 Event emitted:', event.type, event.payload);
    this.eventSubject.next(event);
  }

  /**
   * Subscribe to ALL events (rarely needed)
   * @returns Observable stream of all events
   */
  onAll(): Observable<AppEvent> {
    return this.eventSubject.asObservable();
  }

  /**
   * Subscribe to Authentication events only
   * Filters the event stream to only include auth-related events
   * 
   * @returns Observable stream of AuthEvent objects
   * 
   * Example usage:
   * eventBus.onAuth().subscribe(event => {
   *   if (event.type === 'LOGIN') {
   *     console.log('User logged in:', event.payload);
   *   }
   * });
   */
  onAuth(): Observable<AuthEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((event): event is AuthEvent => 
        ['LOGIN', 'LOGOUT', 'AUTH_STATE_CHANGE'].includes(event.type)
      ),
      map(event => event as AuthEvent)
    );
  }

  /**
   * Subscribe to Cart events only
   * Filters the event stream to only include cart-related events
   * 
   * @returns Observable stream of CartEvent objects
   * 
   * Example usage:
   * eventBus.onCart().subscribe(event => {
   *   if (event.type === 'ADD_TO_CART') {
   *     console.log('Item added:', event.payload);
   *   }
   * });
   */
  onCart(): Observable<CartEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((event): event is CartEvent => 
        ['ADD_TO_CART', 'REMOVE_FROM_CART', 'CLEAR_CART', 'CART_STATE_CHANGE'].includes(event.type)
      ),
      map(event => event as CartEvent)
    );
  }

  // ============================================
  // Helper Methods - Convenience wrappers for common events
  // ============================================

  /**
   * Helper: Emit login event
   * @param user - User object containing token and userData
   */
  login(user: any): void {
    this.emit({ type: 'LOGIN', payload: user });
  }

  /**
   * Helper: Emit logout event
   */
  logout(): void {
    this.emit({ type: 'LOGOUT' });
  }

  /**
   * Helper: Add item to cart
   * @param item - Product to add to cart
   */
  addToCart(item: any): void {
    this.emit({ type: 'ADD_TO_CART', payload: item });
  }

  /**
   * Helper: Remove item from cart
   * @param itemId - ID of product to remove
   */
  removeFromCart(itemId: string): void {
    this.emit({ type: 'REMOVE_FROM_CART', payload: itemId });
  }

  /**
   * Helper: Clear entire cart
   */
  clearCart(): void {
    this.emit({ type: 'CLEAR_CART' });
  }
}

/**
 * Singleton instance of EventBus
 * Import this in any MF to communicate with others
 * 
 * Example:
 * import { eventBus } from 'authApp/eventBus';
 * eventBus.emit({ type: 'ADD_TO_CART', payload: product });
 */
export const eventBus = new EventBus();

// Log initialization for debugging
console.log('✅ EventBus initialized and ready');

// Export default for flexibility
export default eventBus;