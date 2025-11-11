# Micro-Frontend State Management: Three Approaches

## 🎯 Presentation Overview
This guide compares three different approaches for managing state and communication in a micro-frontend architecture with Auth App, Products App, and Cart App.

---

## 📋 Table of Contents
1. [Approach 1: Props & Callbacks (Prop Drilling)](#approach-1-props--callbacks)
2. [Approach 2: Context API](#approach-2-context-api)
3. [Approach 3: Event Bus with RxJS](#approach-3-event-bus-with-rxjs)
4. [Comparison Matrix](#comparison-matrix)
5. [Live Demo Flow](#live-demo-flow)

---

## Approach 1: Props & Callbacks (Prop Drilling)

### 🎤 Key Talking Points

#### **Architecture Overview**
- Traditional parent-child component communication
- Data flows top-down through props
- Changes flow bottom-up through callback functions
- All state managed in top-level component (Auth App)

#### **Implementation Details**

```
┌─────────────────────────────────────────┐
│           Auth App (Parent)             │
│  - Manages: auth state, cart state      │
│  - Passes: userData, token, cartItems   │
│  - Receives: callbacks for updates      │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│ Products App│  │  Cart App   │
│ (Child 1)   │  │  (Child 2)  │
│             │  │             │
│ Receives:   │  │ Receives:   │
│ - token     │  │ - cartItems │
│ - addToCart │  │ - removeItem│
│             │  │ - clearCart │
└─────────────┘  └─────────────┘
```

#### **Code Example Flow**

**Step 1: Parent Component (Auth App)**
```tsx
function AuthApp() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <Layout>
      <ProductsApp 
        token={token} 
        userData={userData}
        addToCart={addToCart} 
      />
      <CartApp 
        cartItems={cartItems}
        removeFromCart={removeFromCart}
      />
    </Layout>
  );
}
```

**Step 2: Child Component (Products App)**
```tsx
function ProductsApp({ token, userData, addToCart }) {
  return (
    <div>
      <h2>Welcome {userData?.name}</h2>
      <ProductsList token={token} addToCart={addToCart} />
    </div>
  );
}

function ProductCard({ product, addToCart }) {
  return (
    <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>
  );
}
```

#### **Pros & Cons**

**✅ Advantages:**
- Simple and straightforward to understand
- Explicit data flow - easy to trace
- No external dependencies
- Type-safe with TypeScript
- Good for small applications

**❌ Disadvantages:**
- **Prop Drilling Hell**: Props passed through multiple levels
- **Tight Coupling**: Child components depend on parent structure
- **Scalability Issues**: Adding new features requires updating all intermediate components
- **Not Suitable for MFs**: Each micro-frontend should be independent
- **Code Duplication**: Same props passed multiple times
- **Maintenance Nightmare**: Refactoring becomes difficult

#### **Real-World Scenario**
```
Auth App (Level 0)
  ↓ passes token, addToCart
Layout (Level 1)
  ↓ passes token, addToCart
Sidebar (Level 2)
  ↓ passes token, addToCart
ProductsApp (Level 3)
  ↓ passes token, addToCart
ProductsList (Level 4)
  ↓ passes token, addToCart
ProductCard (Level 5) ← Finally uses addToCart!

❌ Problem: 5 levels of prop drilling just to pass one function!
```

---

## Approach 2: Context API

### 🎤 Key Talking Points

#### **Architecture Overview**
- React's built-in solution for sharing state
- Provider-Consumer pattern
- Context wraps the component tree
- Any component can access shared data
- Eliminates prop drilling

#### **Implementation Details**

```
┌──────────────────────────────────────────┐
│         AuthProvider (Context)           │
│    - token, userData, login(), logout()  │
└────────────────┬─────────────────────────┘
                 │
         ┌───────┴────────┐
         │                │
┌────────▼─────────┐ ┌───▼─────────────┐
│  CartProvider    │ │   App Structure │
│  - cartItems     │ │                 │
│  - addToCart()   │ │                 │
│  - removeItem()  │ │                 │
└────────┬─────────┘ └───┬─────────────┘
         │               │
         └───────┬───────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
  ┌─────────────┐  ┌─────────────┐
  │ Products App│  │  Cart App   │
  │ useAuth()   │  │ useCart()   │
  │ useCart()   │  │ useAuth()   │
  └─────────────┘  └─────────────┘
```

#### **Code Example Flow**

**Step 1: Create Context**
```tsx
// AuthContext.tsx
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const login = () => {
    const newToken = generateToken();
    setToken(newToken);
    setUserData({ name: 'John Doe' });
  };

  const logout = () => {
    setToken(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ token, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
}
```

**Step 2: Wrap App with Providers**
```tsx
// App.tsx
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="products" element={<ProductsApp />} />
              <Route path="cart" element={<CartApp />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
```

**Step 3: Use Context Anywhere**
```tsx
// ProductsApp.tsx
function ProductCard({ product }) {
  const { token } = useAuth();        // Access auth data
  const { addToCart } = useCart();    // Access cart methods

  return (
    <button 
      onClick={() => addToCart(product)}
      disabled={!token}
    >
      Add to Cart
    </button>
  );
}
```

**Step 4: Module Federation Setup**
```tsx
// vite.config.ts (auth-app)
federation({
  name: 'authApp',
  exposes: {
    './AuthProvider': './src/context/AuthContext.tsx',
    './CartProvider': './src/context/CartContext.tsx',
  },
  shared: ['react', 'react-dom']
})

// vite.config.ts (products-app)
federation({
  name: 'productsApp',
  remotes: {
    authApp: 'http://localhost:5000/assets/remoteEntry.js'
  }
})

// ProductsApp.tsx (in products-app)
import { useAuth } from 'authApp/AuthProvider';
import { useCart } from 'authApp/CartProvider';
```

#### **Pros & Cons**

**✅ Advantages:**
- No prop drilling - access data anywhere
- Clean component APIs
- Easy to add new consumers
- React's built-in solution (no extra dependencies)
- Good TypeScript support
- Works across module federation boundaries

**❌ Disadvantages:**
- **Provider Hell**: Multiple nested providers
- **Dependencies on Parent App**: Products/Cart apps depend on Auth app's context
- **Tight Coupling**: MFs are NOT truly independent
- **Testing Complexity**: Must wrap components in providers for tests
- **Performance Issues**: All consumers re-render when context changes
- **Federation Overhead**: Must expose and import contexts
- **Not True MF**: Defeats the purpose of independent deployments

#### **Real-World Problems**

**Provider Hell Example:**
```tsx
<AuthProvider>
  <ThemeProvider>
    <LanguageProvider>
      <NotificationProvider>
        <CartProvider>
          <UserPreferencesProvider>
            <App /> {/* 😱 6 levels deep! */}
          </UserPreferencesProvider>
        </CartProvider>
      </NotificationProvider>
    </LanguageProvider>
  </ThemeProvider>
</AuthProvider>
```

**Dependency Issue:**
```
❌ Problem: Products App depends on Auth App's Context
   - If Auth App changes context structure → Products App breaks
   - Can't deploy Products App independently
   - Version conflicts between apps
   - Not truly independent micro-frontends
```

---

## Approach 3: Event Bus with RxJS

### 🎤 Key Talking Points

#### **Architecture Overview**
- Fully decoupled micro-frontends
- Pub/Sub pattern using RxJS
- Event-driven communication
- Each MF maintains its own state
- No direct dependencies between MFs
- True micro-frontend independence

#### **Implementation Details**

```
┌──────────────────────────────────────────────────────────┐
│                     EVENT BUS (RxJS)                      │
│              Global Communication Channel                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Subject (Observable Stream)                      │   │
│  │  - Receives all events                            │   │
│  │  - Broadcasts to subscribers                      │   │
│  └──────────────────────────────────────────────────┘   │
└────────┬────────────────────┬───────────────────┬────────┘
         │                    │                   │
    ┌────▼────┐         ┌────▼────┐        ┌────▼────┐
    │ Auth App│         │Products │        │Cart App │
    │         │         │  App    │        │         │
    │ Emits:  │         │         │        │         │
    │ - LOGIN │         │ Emits:  │        │ Listens:│
    │ - LOGOUT│         │ ADD_TO  │        │ - CART_ │
    │         │         │ _CART   │        │   STATE │
    │Listens: │         │         │        │ - ADD_  │
    │ - AUTH_ │         │Listens: │        │   TO_   │
    │   STATE │         │ - LOGIN │        │   CART  │
    │   REQUEST│        │ - LOGOUT│        │         │
    └─────────┘         │ - CART_ │        └─────────┘
                        │   STATE │
                        └─────────┘

         ↓                   ↓                  ↓
   Each app is           Each app is        Each app is
   independent          independent         independent
```

#### **Code Example Flow**

**Step 1: Create Event Bus**
```tsx
// eventBus/index.ts
import { Subject, Observable, filter } from 'rxjs';

// Define event types
export interface AuthEvent {
  type: 'LOGIN' | 'LOGOUT' | 'AUTH_STATE_CHANGE';
  payload?: any;
}

export interface CartEvent {
  type: 'ADD_TO_CART' | 'REMOVE_FROM_CART' | 'CLEAR_CART' | 'CART_STATE_CHANGE';
  payload?: any;
}

export type AppEvent = AuthEvent | CartEvent;

// Event Bus Class
class EventBus {
  private eventSubject = new Subject<AppEvent>();

  // Emit an event
  emit(event: AppEvent): void {
    console.log('🚀 Event emitted:', event.type, event.payload);
    this.eventSubject.next(event);
  }

  // Subscribe to auth events only
  onAuth(): Observable<AuthEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((event): event is AuthEvent => 
        ['LOGIN', 'LOGOUT', 'AUTH_STATE_CHANGE'].includes(event.type)
      )
    );
  }

  // Subscribe to cart events only
  onCart(): Observable<CartEvent> {
    return this.eventSubject.asObservable().pipe(
      filter((event): event is CartEvent => 
        ['ADD_TO_CART', 'REMOVE_FROM_CART', 'CLEAR_CART', 'CART_STATE_CHANGE'].includes(event.type)
      )
    );
  }
}

export const eventBus = new EventBus();
```

**Step 2: Create Services (Auth App)**
```tsx
// services/authService.ts
import { eventBus } from '../eventBus';
import { store } from '../store';

class AuthService {
  constructor() {
    // Listen to Redux store changes
    store.subscribe(() => {
      const { token, userData } = store.getState().auth;
      // Broadcast auth state changes to all MFs
      eventBus.emit({
        type: 'AUTH_STATE_CHANGE',
        payload: { token, userData }
      });
    });

    // Listen to requests from other MFs
    eventBus.onAuth().subscribe((event) => {
      if (event.type === 'AUTH_STATE_CHANGE' && 
          event.payload === 'REQUEST_STATE') {
        // Send current state
        const state = store.getState();
        eventBus.emit({
          type: 'AUTH_STATE_CHANGE',
          payload: { 
            token: state.auth.token, 
            userData: state.auth.userData 
          }
        });
      }
    });
  }
}

export const authService = new AuthService();
```

```tsx
// services/cartService.ts
import { eventBus } from '../eventBus';

class CartService {
  private cartItems = [];

  constructor() {
    // Listen to cart events from any MF
    eventBus.onCart().subscribe((event) => {
      switch (event.type) {
        case 'ADD_TO_CART':
          this.addToCart(event.payload);
          break;
        case 'REMOVE_FROM_CART':
          this.removeFromCart(event.payload);
          break;
        case 'CART_STATE_CHANGE':
          if (event.payload === 'REQUEST_STATE') {
            this.broadcastCartState();
          }
          break;
      }
    });
  }

  private addToCart(product) {
    if (!this.cartItems.find(item => item.id === product.id)) {
      this.cartItems = [...this.cartItems, product];
      this.broadcastCartState();
    }
  }

  private broadcastCartState() {
    eventBus.emit({
      type: 'CART_STATE_CHANGE',
      payload: [...this.cartItems]
    });
  }
}

export const cartService = new CartService();
```

**Step 3: Products App (Independent)**
```tsx
// ProductsApp.tsx
import { useState, useEffect } from 'react';
import { eventBus } from 'authApp/eventBus';

function ProductsApp() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Subscribe to auth events
    const subscription = eventBus.onAuth().subscribe((event) => {
      if (event.type === 'LOGIN' || event.type === 'AUTH_STATE_CHANGE') {
        setToken(event.payload.token);
        setUserData(event.payload.userData);
      }
    });

    // Request current auth state on mount
    eventBus.emit({ type: 'AUTH_STATE_CHANGE', payload: 'REQUEST_STATE' });

    return () => subscription.unsubscribe();
  }, []);

  return token ? <ProductsList /> : <p>Please login</p>;
}
```

```tsx
// ProductCard.tsx
function ProductCard({ product }) {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    // Listen to cart updates
    const subscription = eventBus.onCart().subscribe((event) => {
      if (event.type === 'CART_STATE_CHANGE') {
        setIsInCart(event.payload.some(item => item.id === product.id));
      }
    });

    // Request current cart state
    eventBus.emit({ type: 'CART_STATE_CHANGE', payload: 'REQUEST_STATE' });

    return () => subscription.unsubscribe();
  }, [product.id]);

  const handleAddToCart = () => {
    // Just emit event - no direct dependency
    eventBus.emit({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <button onClick={handleAddToCart} disabled={isInCart}>
      {isInCart ? 'In Cart' : 'Add to Cart'}
    </button>
  );
}
```

**Step 4: Cart App (Independent)**
```tsx
// Cart.tsx
import { useState, useEffect } from 'react';
import { eventBus } from 'authApp/eventBus';

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Listen to cart state changes
    const subscription = eventBus.onCart().subscribe((event) => {
      if (event.type === 'CART_STATE_CHANGE' && Array.isArray(event.payload)) {
        setCartItems(event.payload);
      }
    });

    // Request current cart state
    eventBus.emit({ type: 'CART_STATE_CHANGE', payload: 'REQUEST_STATE' });

    return () => subscription.unsubscribe();
  }, []);

  const handleRemove = (id) => {
    // Just emit event
    eventBus.emit({ type: 'REMOVE_FROM_CART', payload: id });
  };

  return (
    <div>
      <h2>Cart ({cartItems.length} items)</h2>
      {cartItems.map(item => (
        <div key={item.id}>
          {item.title}
          <button onClick={() => handleRemove(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

**Step 5: Federation Setup (Only EventBus Shared)**
```tsx
// vite.config.ts (auth-app)
federation({
  name: 'authApp',
  exposes: {
    './eventBus': './src/eventBus/index.ts'  // ← Only expose EventBus
  },
  shared: ['react', 'react-dom', 'rxjs']
})

// vite.config.ts (products-app)
federation({
  name: 'productsApp',
  remotes: {
    authApp: 'http://localhost:5000/assets/remoteEntry.js'
  },
  exposes: {
    './ProductsApp': './src/ProductsApp.tsx'
  },
  shared: ['react', 'react-dom', 'rxjs']
})
```

#### **Event Flow Diagram**

```
User Action: Click "Add to Cart" in Products App
│
├─ 1. ProductCard emits event
│     eventBus.emit({ type: 'ADD_TO_CART', payload: product })
│
├─ 2. Event Bus broadcasts to all subscribers
│     │
│     ├─ Auth App: CartService receives event
│     │   │
│     │   ├─ Validates product not already in cart
│     │   ├─ Adds product to internal cartItems array
│     │   └─ Broadcasts cart state change
│     │       eventBus.emit({ 
│     │         type: 'CART_STATE_CHANGE', 
│     │         payload: [product1, product2, newProduct] 
│     │       })
│     │
│     ├─ Products App: All ProductCards receive CART_STATE_CHANGE
│     │   └─ Update their isInCart state
│     │       setIsInCart(cartItems.some(item => item.id === product.id))
│     │
│     ├─ Cart App: Cart component receives CART_STATE_CHANGE
│     │   └─ Updates displayed cart items
│     │       setCartItems(event.payload)
│     │
│     └─ Auth App: Layout receives CART_STATE_CHANGE
│         └─ Updates cart count in sidebar
│             setCartItems(event.payload)
│
└─ 3. UI Updates Everywhere (Automatically!)
      - ProductCard button → "In Cart" (disabled)
      - Cart page → Shows new item
      - Sidebar → Cart count increases
```

#### **Pros & Cons**

**✅ Advantages:**
- **True Independence**: Each MF works standalone
- **Zero Coupling**: No direct dependencies between MFs
- **Easy Testing**: Each MF can be tested in isolation
- **Independent Deployment**: Deploy any MF without affecting others
- **Scalability**: Add new MFs without touching existing ones
- **Performance**: Only components that care about events re-render
- **Flexibility**: Easy to add new event types
- **Debugging**: Console logs show exact event flow
- **Real Micro-Frontends**: Follows true MF architecture principles

**❌ Disadvantages:**
- Learning curve for RxJS
- Need to manage subscriptions (memory leaks if not cleaned up)
- Requires documentation of event contracts
- Slightly more complex setup initially

---

## Comparison Matrix

| Feature | Props & Callbacks | Context API | Event Bus (RxJS) |
|---------|------------------|-------------|------------------|
| **Independence** | ❌ Tightly coupled | ⚠️ Depends on parent | ✅ Fully independent |
| **Prop Drilling** | ❌ Severe | ✅ Eliminated | ✅ Eliminated |
| **Scalability** | ❌ Poor | ⚠️ Medium | ✅ Excellent |
| **Testing** | ⚠️ Medium | ❌ Difficult | ✅ Easy (isolated) |
| **Performance** | ✅ Good | ⚠️ Re-renders | ✅ Optimized |
| **Setup Complexity** | ✅ Simple | ⚠️ Medium | ⚠️ Medium |
| **MF Architecture** | ❌ Not suitable | ⚠️ Semi-suitable | ✅ Perfect fit |
| **Independent Deploy** | ❌ No | ⚠️ Limited | ✅ Yes |
| **Code Maintainability** | ❌ Poor | ⚠️ Medium | ✅ Excellent |
| **Real-time Sync** | ❌ Manual | ⚠️ Context updates | ✅ Automatic |
| **Learning Curve** | ✅ Easy | ✅ Easy | ⚠️ RxJS knowledge |
| **Best For** | Small apps | Single apps | Micro-frontends |

---

## Live Demo Flow

### 🎬 Demo Scenario: Shopping Flow

#### **Demo 1: Props & Callbacks (Show Problems)**

1. **Start**: Open code editor
   - Show App.tsx with all state at top
   - Point out props being passed down multiple levels
   
2. **Add Feature**: "Let's add a favorites feature"
   - Show how you need to update 5+ components
   - Each component needs new props
   - Demonstrate the pain of prop drilling

3. **Problem**: 
   - "Notice how Products App can't work without Auth App structure?"
   - "What if we want to deploy Products App separately?"

#### **Demo 2: Context API (Show Improvement)**

1. **Start**: Show Context providers wrapping app
   ```tsx
   <AuthProvider>
     <CartProvider>
       <FavoritesProvider>
         <App />  {/* Already 3 levels deep! */}
   ```

2. **Improvement**: 
   - "No prop drilling! ProductCard can useCart() directly"
   - Show clean component APIs

3. **Problem**: 
   - Open Products App vite.config
   - Show it imports from 'authApp/CartProvider'
   - "Products App depends on Auth App's internal structure"
   - "Can't deploy independently"

#### **Demo 3: Event Bus (Show Solution)**

1. **Start**: Open EventBus code
   - Explain pub/sub pattern with simple diagram
   - "Think of it like a radio station - anyone can tune in"

2. **Flow Demo**:
   - **User clicks "Add to Cart" in Products App**
   - Show console: `🚀 Event emitted: ADD_TO_CART { product }`
   - Show CartService receiving it
   - Show broadcast: `📢 Broadcasting cart state: 1 items`
   - Show multiple components updating simultaneously:
     * Cart page updates
     * Sidebar count increases
     * Product button changes to "In Cart"

3. **Independence Demo**:
   - "Products App only imports EventBus"
   - "Doesn't know about Auth App's internal structure"
   - "Can deploy Products App separately"
   - Show running Products App standalone

4. **Add New MF Demo**:
   - "Let's add a Favorites App"
   - Create new event types: ADD_TO_FAVORITES
   - Products App emits event
   - Favorites App subscribes
   - **No changes to existing apps!**

---

## 🎯 Key Talking Points for Each Approach

### Props & Callbacks
- ❌ "This is how we used to do it"
- ❌ "Works for small apps, nightmare for scaling"
- ❌ "Impossible for true micro-frontends"

### Context API
- ⚠️ "React's solution to prop drilling"
- ⚠️ "Good for single applications"
- ⚠️ "But creates dependencies between MFs"
- ⚠️ "Not truly independent deployments"

### Event Bus
- ✅ "True micro-frontend architecture"
- ✅ "Complete independence between apps"
- ✅ "Can deploy any app anytime"
- ✅ "Easy to add new features and MFs"
- ✅ "Industry standard for MF communication"

---

## 🚀 Conclusion

### When to Use Each:

1. **Props & Callbacks**: 
   - Small, single-page apps
   - Teaching React basics
   - When you need maximum simplicity

2. **Context API**: 
   - Single React applications
   - When you don't need independent deployments
   - Monolithic architectures

3. **Event Bus**: 
   - **Micro-frontend architectures** ← Your use case
   - When apps need to be independently deployable
   - When you want loose coupling
   - When you need scalability
   - When multiple teams work on different parts

### Final Recommendation:
**For micro-frontends: Always use Event Bus (Approach 3)**

---

## 📚 Additional Resources

- **RxJS Documentation**: https://rxjs.dev/
- **Module Federation**: https://module-federation.github.io/
- **Micro-Frontend Architecture**: https://micro-frontends.org/

---

## 🎤 Presentation Tips

1. **Start with Pain**: Show prop drilling nightmare
2. **Show Evolution**: Context API as improvement
3. **Reveal Solution**: Event Bus as ultimate solution
4. **Live Demo**: Run the actual apps and show events in console
5. **Add Feature Live**: Show how easy it is to add new MF with Event Bus
6. **Emphasize Independence**: Deploy one app without touching others

---

**Remember**: The goal is to show that Event Bus enables TRUE micro-frontend architecture where each app is:
- Independently deployable
- Loosely coupled
- Highly scalable
- Easy to maintain