import React, { Suspense } from 'react';

type ProductsAppType = React.ComponentType;

const ProductsApp = React.lazy(() => import('productsApp/ProductsApp') as Promise<{ default: ProductsAppType }>);

const Home = () => {
  return (
    <div>
      <h1>Home Page Content</h1>
      <div style={{overflow:'auto'}}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductsApp />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
