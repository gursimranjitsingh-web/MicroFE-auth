import React from 'react';
import { Suspense } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

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

interface HomeProps {
  cartItems: Product[];
  onAddToCart: (product: Product) => void;
}

type ProductsAppType = React.ComponentType<ProductsAppProps>;

const ProductsApp = React.lazy(() => import('productsApp/ProductsApp') as Promise<{ default: ProductsAppType }>);

const Home: React.FC<HomeProps> = ({ cartItems, onAddToCart }) => {
  const { token, userData } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1>Home Page Content</h1>
      <div style={{overflow:'auto'}}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsApp
            token={token}
            userData={userData}
            cartItems={cartItems}
            onAddToCart={onAddToCart}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
