import React from 'react';
import ProductsList from './components/ProductsList';
import { useAuth } from 'authApp/AuthProvider';

const ProductsApp: React.FC = () => {
  const { userData, token } = useAuth();

  return (
    <div>
      <h2>Products</h2>
      {userData && <p>Welcome, {userData.name}!</p>}
      {token && <ProductsList />}
    </div>
  );
};

export default ProductsApp;