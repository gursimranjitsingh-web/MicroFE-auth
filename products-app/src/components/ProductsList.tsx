import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { eventBus } from 'authApp/eventBus';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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

    // Request current auth state on mount
    eventBus.emit({ type: 'AUTH_STATE_CHANGE', payload: 'REQUEST_STATE' });

    return () => authSubscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch products immediately on mount
    fetch('https://fakestoreapi.com/products', {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsList;