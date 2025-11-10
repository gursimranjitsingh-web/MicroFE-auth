import React from 'react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

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
                  onClick={() => removeFromCart(item.id)}
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
              onClick={clearCart}
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