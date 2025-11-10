import React, { useState, useEffect } from 'react';
import { eventBus } from 'authApp/eventBus';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Subscribe to cart events
    const subscription = eventBus.onCart().subscribe((event: any) => {
      switch (event.type) {
        case 'ADD_TO_CART':
          setCartItems(prev => {
            const existing = prev.find(item => item.id === event.payload.id);
            if (!existing) {
              return [...prev, event.payload];
            }
            return prev;
          });
          break;
        case 'REMOVE_FROM_CART':
          setCartItems(prev => prev.filter(item => item.id !== event.payload));
          break;
        case 'CLEAR_CART':
          setCartItems([]);
          break;
        case 'CART_STATE_CHANGE':
          if (Array.isArray(event.payload)) {
            setCartItems(event.payload);
          }
          break;
      }
    });

    // Request current cart state on mount
    eventBus.emit({ type: 'CART_STATE_CHANGE', payload: 'REQUEST_STATE' });

    return () => subscription.unsubscribe();
  }, []);

  const handleRemoveFromCart = (itemId: number) => {
    eventBus.emit({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const handleClearCart = () => {
    eventBus.emit({ type: 'CLEAR_CART' });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Shopping Cart ({cartItems.length} items)</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <div style={{ marginBottom: '2rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <img src={item.image} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.title}</h3>
                  <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>${item.price}</p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div style={{
            borderTop: '2px solid #ddd',
            paddingTop: '1rem',
            textAlign: 'right'
          }}>
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button
              onClick={handleClearCart}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '1rem'
              }}
            >
              Clear Cart
            </button>
            <button
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;