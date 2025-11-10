import React, { useState, useEffect } from 'react';
import ProductsList from './components/ProductsList';
import { eventBus } from 'authApp/eventBus';

const ProductsApp: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Subscribe to auth events
    const subscription = eventBus.onAuth().subscribe((event: any) => {
      switch (event.type) {
        case 'LOGIN':
          setUserData(event.payload.userData);
          break;
        case 'LOGOUT':
          setUserData(null);
          break;
        case 'AUTH_STATE_CHANGE':
          if (event.payload) {
            setUserData(event.payload.userData);
          }
          break;
      }
    });

    // Request current auth state on mount
    eventBus.emit({ type: 'AUTH_STATE_CHANGE', payload: 'REQUEST_STATE' });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {userData && <p>Welcome, {userData.name}!</p>}
      <ProductsList />
    </div>
  );
};

export default ProductsApp;