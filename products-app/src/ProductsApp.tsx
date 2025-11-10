import React from 'react';
import ProductsList from './components/ProductsList';

interface UserData {
  name: string;
  role: string;
  permissions: string[];
  theme: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductsAppProps {
  token?: string | null;
  userData?: UserData | null;
  cartItems: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductsApp: React.FC<ProductsAppProps> = ({ token, userData, cartItems, onAddToCart }) => {
  return (
    <div>
      <h2>Products</h2>
      {userData && <p>Welcome, {userData.name}!</p>}
      {token &&  <ProductsList onAddToCart={onAddToCart} cartItems={cartItems} />}
    </div>
  );
};

export default ProductsApp;