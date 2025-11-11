# Event-Driven Micro-Frontend Architecture - Complete Explanation

## 📚 Table of Contents
1. [Overview](#overview)
2. [Event Bus Architecture](#event-bus-architecture)
3. [Services Layer](#services-layer)
4. [Data Flow](#data-flow)
5. [Communication Patterns](#communication-patterns)

---

## Overview

### What Problem Does This Solve?

**Traditional Problem:**
- Micro-frontends (MFs) were tightly coupled through Context API
- Products-app and Cart-app depended on auth-app's React Context
- Had to wrap components in providers
- Changes in one MF affected others
- Couldn't work independently

**Event-Driven Solution:**
- Complete decoupling - no shared state or context
- Each MF maintains its own independent state
- Communication only through events
- Can add/remove MFs without touching existing code
- True micro-frontend independence

---

## Event Bus Architecture

### The Core: EventBus Class

Located in: `auth-app/src/eventBus/index.ts`

```typescript
class EventBus {
  // Private RxJS Subject - the heart of the event system
  private eventSubject = new Subject<AppEvent>();
  
  // Emit events to all subscribers
  emit(event: AppEvent): void {
    this.eventSubject.next(event);
  }
  
  // Subscribe to specific event types
  onAuth(): Observable<AuthEvent> { ... }
  onCart(): Observable<CartEvent> { ... }
}
```

### How It Works

1. **Singleton Pattern**
   ```typescript
   export const eventBus = new EventBus();
   ```
   - Single instance shared across ALL micro-frontends
   - Federated from auth-app to products-app and cart-app
   - Everyone talks through this one instance

2. **RxJS Subject**
   - Subject = both Observable (can subscribe) and Observer (can emit)
   - Hot observable - broadcasts to all active subscribers
   - New subscribers don't get past events (stateless)

3. **Type Safety**
   ```typescript
   interface AuthEvent {
     type: 'LOGIN' | 'LOGOUT' | 'AUTH_STATE_CHANGE';
     payload?: any;
   }
   
   interface CartEvent {
     type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'CLEAR_CART' | 'CART_STATE_CHANGE';
     payload?: any;
   }
   ```

4. **Event Filtering**
   ```typescript
   onAuth(): Observable<AuthEvent> {
     return this.eventSubject.asObservable().pipe(
       filter((event) => ['LOGIN', 'LOGOUT', 'AUTH_STATE_CHANGE'].includes(event.type)),
       map(event => event as AuthEvent)
     );
   }
   ```
   - Filters only auth-related events
   - Products-app doesn't see cart events
   - Clean separation of concerns

---

## Services Layer

### 1. AuthService (auth-app/src/services/authService.ts)

**Purpose:** Central authority for authentication state

```typescript
class AuthService {
  constructor() {
    // Listen to Redux store changes
    store.subscribe(() => {
      const state = store.getState();
      const { token, userData } = state.auth;
      
      // Broadcast to all MFs
      eventBus.emit({
        type: 'AUTH_STATE_CHANGE',
        payload: { token, userData }
      });
    });
    
    // Handle state requests from other MFs
    eventBus.onAuth().subscribe((event) => {
      if (event.type === 'AUTH_STATE_CHANGE' && event.payload === 'REQUEST_STATE') {
        // Send current state
        const state = store.getState();
        eventBus.emit({
          type: 'AUTH_STATE_CHANGE',
          payload: { token: state.auth.token, userData: state.auth.userData }
        });
      }
    });
  }
}
```

**Key Responsibilities:**
- Monitors Redux store for auth changes
- Emits events when user logs in/out
- Responds to state requests from other MFs
- Single source of truth for auth state

### 2. CartService (auth-app/src/services/cartService.ts)

**Purpose:** Central authority for cart state

```typescript
class CartService {
  private cartItems: Product[] = [];
  private isProcessing = false; // Prevents infinite loops
  
  constructor() {
    // Listen for cart operations
    eventBus.onCart().subscribe((event) => {
      switch (event.type) {
        case 'ADD_TO_CART':
          if (!this.isProcessing) {
            this.addToCart(event.payload);
          }
          break;
        case 'CART_STATE_CHANGE':
          if (event.payload === 'REQUEST_STATE') {
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
      this.isProcessing = true; // Flag to prevent loop
      this.broadcastCartState();
      this.isProcessing = false;
    }
  }
  
  private broadcastCartState(): void {
    eventBus.emit({
      type: 'CART_STATE_CHANGE',
      payload: [...this.cartItems] // Send copy of array
    });
  }
}
```

**Key Responsibilities:**
- Maintains cart state in memory
- Handles add/remove/clear operations
- Prevents duplicate items
- Broadcasts state changes to all MFs
- Responds to state requests

---

## Data Flow

### Scenario 1: User Logs In

```
1. USER CLICKS LOGIN
   ↓
2. auth-app/Login.tsx
   dispatch(login())
   ↓
3. Redux Store (authSlice)
   state.token = 'xyz123'
   state.userData = { name: 'John' }
   ↓
4. AuthService (monitors Redux)
   store.subscribe() detects change
   ↓
5. EVENT EMITTED
   eventBus.emit({
     type: 'AUTH_STATE_CHANGE',
     payload: { token: 'xyz123', userData: {...} }
   })
   ↓
6. ALL SUBSCRIBERS RECEIVE EVENT
   ├─→ products-app/ProductsApp.tsx
   │   ├─ setToken('xyz123')
   │   ├─ setUserData({...})
   │   └─ setIsReady(true)
   │
   ├─→ products-app/ProductsList.tsx
   │   ├─ setToken('xyz123')
   │   └─ fetch products with token
   │
   └─→ products-app/ProductCard.tsx
       └─ setToken('xyz123')
```

### Scenario 2: Adding Item to Cart

```
1. USER CLICKS "ADD TO CART" on Product
   ↓
2. products-app/ProductCard.tsx
   eventBus.emit({
     type: 'ADD_TO_CART',
     payload: { id: 1, title: 'Product', price: 99, image: '...' }
   })
   ↓
3. CartService (auth-app) RECEIVES EVENT
   eventBus.onCart().subscribe(...)
   ├─ Check if already in cart? No
   ├─ Add to cartItems array
   └─ Call broadcastCartState()
   ↓
4. CartService BROADCASTS STATE
   eventBus.emit({
     type: 'CART_STATE_CHANGE',
     payload: [{ id: 1, ... }] // Array with 1 item
   })
   ↓
5. ALL SUBSCRIBERS RECEIVE CART STATE
   ├─→ auth-app/Layout.tsx (sidebar)
   │   └─ setCartItems([...]) → Shows "Cart (1)"
   │
   ├─→ cart-app/Cart.tsx
   │   └─ setCartItems([...]) → Displays item in cart
   │
   └─→ products-app/ProductCard.tsx
       └─ setIsInCart(true) → Button shows "In Cart"
```

### Scenario 3: MF Mounts and Requests State

```
1. products-app/ProductsApp.tsx MOUNTS
   useEffect(() => { ... }, [])
   ↓
2. SUBSCRIBE TO AUTH EVENTS
   eventBus.onAuth().subscribe((event) => { ... })
   ↓
3. REQUEST CURRENT STATE
   eventBus.emit({
     type: 'AUTH_STATE_CHANGE',
     payload: 'REQUEST_STATE' // Special flag
   })
   ↓
4. AuthService RECEIVES REQUEST
   if (event.payload === 'REQUEST_STATE') {
     // Don't trigger infinite loop
     if (!this.isRespondingToRequest) {
       this.isRespondingToRequest = true;
       
       // Get current state from Redux
       const state = store.getState();
       
       // Send it back
       eventBus.emit({
         type: 'AUTH_STATE_CHANGE',
         payload: { token: state.auth.token, userData: state.auth.userData }
       });
       
       this.isRespondingToRequest = false;
     }
   }
   ↓
5. products-app RECEIVES STATE
   ProductsApp sets token and userData
   → Now initialized and ready to work
```

---

## Communication Patterns

### 1. State Request Pattern

**When:** MF mounts and needs current state

```typescript
// Requester (any MF)
useEffect(() => {
  const subscription = eventBus.onAuth().subscribe((event) => {
    if (event.type === 'AUTH_STATE_CHANGE' && event.payload !== 'REQUEST_STATE') {
      setToken(event.payload.token);
    }
  });
  
  // Request state
  eventBus.emit({ type: 'AUTH_STATE_CHANGE', payload: 'REQUEST_STATE' });
  
  return () => subscription.unsubscribe();
}, []);

// Responder (service)
eventBus.onAuth().subscribe((event) => {
  if (event.payload === 'REQUEST_STATE') {
    if (!this.isRespondingToRequest) {
      this.isRespondingToRequest = true;
      const state = getCurrentState();
      eventBus.emit({ type: 'AUTH_STATE_CHANGE', payload: state });
      this.isRespondingToRequest = false;
    }
  }
});
```

**Why the flags?**
- Prevents infinite loops
- REQUEST_STATE event shouldn't trigger another request
- Clean separation between request and response

### 2. Command Pattern

**When:** MF wants to perform an action

```typescript
// Command (products-app)
const handleAddToCart = () => {
  eventBus.emit({
    type: 'ADD_TO_CART',
    payload: product
  });
};

// Handler (cartService)
eventBus.onCart().subscribe((event) => {
  if (event.type === 'ADD_TO_CART') {
    this.addToCart(event.payload);
  }
});
```

**Benefits:**
- Fire and forget
- Don't need to know who handles it
- Service decides how to handle

### 3. Broadcast Pattern

**When:** State changes and everyone needs to know

```typescript
// Broadcaster (cartService)
private broadcastCartState(): void {
  eventBus.emit({
    type: 'CART_STATE_CHANGE',
    payload: [...this.cartItems]
  });
}

// Listeners (all MFs)
eventBus.onCart().subscribe((event) => {
  if (event.type === 'CART_STATE_CHANGE') {
    setCartItems(event.payload);
  }
});
```

**Benefits:**
- One broadcast, multiple listeners
- Everyone stays in sync
- No direct dependencies

---

## Key Concepts

### 1. Single Source of Truth

- **Auth State:** Redux store in auth-app → monitored by AuthService
- **Cart State:** CartService's private cartItems array
- **Product State:** Each ProductsList maintains its own (loaded from API)

### 2. Event-Driven vs State-Sharing

**Traditional (Context API):**
```typescript
// ❌ Tight coupling
<AuthProvider>
  <CartProvider>
    <ProductsApp /> // Depends on providers
  </CartProvider>
</AuthProvider>
```

**Event-Driven:**
```typescript
// ✅ Complete independence
<ProductsApp /> // Works standalone, listens to events
```

### 3. Preventing Infinite Loops

**Problem:** Service emits event → subscribes to same event → emits again

**Solution:** Use flags
```typescript
private isProcessing = false;

eventBus.onCart().subscribe((event) => {
  if (!this.isProcessing) { // Check flag
    this.isProcessing = true; // Set flag
    this.processEvent(event);
    this.isProcessing = false; // Clear flag
  }
});
```

### 4. Initialization Flow

```
1. auth-app loads
   ├─ main.tsx imports services
   ├─ AuthService initializes
   ├─ CartService initializes
   └─ After 100ms, broadcast initial state

2. products-app loads (federated)
   ├─ Imports eventBus from auth-app
   ├─ ProductsApp subscribes to events
   ├─ Requests current auth state
   └─ Receives state → ready to work

3. cart-app loads (federated)
   ├─ Imports eventBus from auth-app
   ├─ Cart subscribes to cart events
   ├─ Requests current cart state
   └─ Receives state → ready to display
```

---

## Benefits of This Architecture

1. **Complete Decoupling**
   - No shared React context or providers
   - Each MF can work independently
   - Easy to test in isolation

2. **Scalability**
   - Add new MFs without touching existing code
   - Just subscribe to events you care about
   - No cascading changes

3. **Real-time Synchronization**
   - All MFs stay in sync automatically
   - One state change → everyone updated
   - No manual coordination needed

4. **Type Safety**
   - TypeScript interfaces for all events
   - Compile-time checks
   - IntelliSense support

5. **Debugging**
   - Console logs show event flow
   - Easy to trace data movement
   - Clear understanding of who emits/subscribes

---

## Example: Complete Flow of Adding to Cart

```
USER INTERACTION
  |
  v
ProductCard.tsx (products-app)
  handleAddToCart() called
  |
  v
EVENT EMITTED
  eventBus.emit({ type: 'ADD_TO_CART', payload: product })
  |
  v
RXJS SUBJECT BROADCASTS
  All onCart() subscribers notified
  |
  +-- Branch 1: CartService (auth-app)
  |   |
  |   v
  |   cartService.addToCart(product)
  |   - Check if already exists
  |   - Add to cartItems array
  |   - Call broadcastCartState()
  |   |
  |   v
  |   EVENT EMITTED
  |   eventBus.emit({ type: 'CART_STATE_CHANGE', payload: [...cartItems] })
  |   |
  |   v
  |   RXJS SUBJECT BROADCASTS AGAIN
  |   All onCart() subscribers notified
  |
  +-- Branch 2: Layout.tsx (auth-app sidebar)
  |   |
  |   v
  |   Receives CART_STATE_CHANGE
  |   setCartItems(event.payload)
  |   - Re-renders sidebar with new count
  |
  +-- Branch 3: Cart.tsx (cart-app)
  |   |
  |   v
  |   Receives CART_STATE_CHANGE
  |   setCartItems(event.payload)
  |   - Re-renders cart page with new item
  |
  +-- Branch 4: ProductCard.tsx (products-app)
      |
      v
      Receives CART_STATE_CHANGE
      Check if product.id in event.payload
      setIsInCart(true)
      - Re-renders button to show "In Cart"
```

---

## Summary

**The Magic:**
- One EventBus instance shared across all MFs (via module federation)
- Services in auth-app maintain state and respond to events
- MFs subscribe to events and update their local state
- No direct dependencies or shared context
- True micro-frontend independence

**The Result:**
- Clean, maintainable, scalable architecture
- Easy to add/remove features
- Complete separation of concerns
- Real-time synchronization across all apps
