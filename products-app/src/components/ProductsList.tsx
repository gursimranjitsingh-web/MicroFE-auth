import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useAuth } from 'authApp/AuthProvider';


interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetch('https://fakestoreapi.com/products',{ headers: {
      'Authorization': `Bearer ${token}`
    }})
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

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