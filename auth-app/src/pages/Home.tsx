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

interface ProductsAppProps {
  token?: string | null;
  userData?: UserData | null;
}

type ProductsAppType = React.ComponentType<ProductsAppProps>;

const ProductsApp = React.lazy(() => import('productsApp/ProductsApp') as Promise<{ default: ProductsAppType }>);

const Home = () => {
  const { token, userData } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      <h1>Home Page Content</h1>
      <div style={{overflow:'auto'}}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsApp token={token} userData={userData} />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
