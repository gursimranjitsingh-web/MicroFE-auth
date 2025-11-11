import { useState, useEffect } from 'react';
import { eventBus } from 'authApp/eventBus';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isInCart, setIsInCart] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to auth events to get token
    const authSubscription = eventBus.onAuth().subscribe((event: any) => {
      switch (event.type) {
        case 'LOGIN':
          setToken(event.payload.token);
          break;
        case 'LOGOUT':
          setToken(null);
          break;
        case 'AUTH_STATE_CHANGE':
          if (event.payload) {
            setToken(event.payload.token);
          }
          break;
      }
    });

    // Subscribe to cart events to update local state
    const cartSubscription = eventBus.onCart().subscribe((event: any) => {
      switch (event.type) {
        case 'ADD_TO_CART':
          if (event.payload.id === product.id) {
            setIsInCart(true);
          }
          break;
        case 'REMOVE_FROM_CART':
          if (event.payload === product.id) {
            setIsInCart(false);
          }
          break;
        case 'CLEAR_CART':
          setIsInCart(false);
          break;
        case 'CART_STATE_CHANGE':
          if (event.payload && Array.isArray(event.payload)) {
            setIsInCart(event.payload.some((item: any) => item.id === product.id));
          }
          break;
      }
    });

    // Request current auth and cart state on mount
    eventBus.emit({ type: 'AUTH_STATE_CHANGE', payload: 'REQUEST_STATE' });
    eventBus.emit({ type: 'CART_STATE_CHANGE', payload: 'REQUEST_STATE' });

    return () => {
      authSubscription.unsubscribe();
      cartSubscription.unsubscribe();
    };
  }, [product.id]);

  const handleAddToCart = () => {
    if (token) {
      eventBus.emit({ type: 'ADD_TO_CART', payload: product });
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem',
      width: '250px',
      textAlign: 'center'
    }}>
      <img src={product.image} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{product.title}</h3>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>${product.price}</p>
      <button
        onClick={handleAddToCart}
        // disabled={isInCart || !token}
        style={{
          backgroundColor: isInCart ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          // cursor: isInCart || !token ? 'not-allowed' : 'pointer'
        }}
      >
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;