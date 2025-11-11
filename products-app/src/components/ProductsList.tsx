import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const ProductsList = ({token}:{token:string | null}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    // Only fetch products when we have a token
    if (token) {
      console.log('🔍 Fetching products with token...');
      fetch('https://fakestoreapi.com/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log('✅ Products loaded:', data.length);
          setProducts(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('❌ Error fetching products:', error);
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (!token) {
    return <div>Please log in to view products</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} token={token} />
      ))}
    </div>
  );
};

export default ProductsList;