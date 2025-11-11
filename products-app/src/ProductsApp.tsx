import React, { useState, useEffect } from 'react';
import ProductsList from './components/ProductsList';
import { eventBus } from 'authApp/eventBus';

const ProductsApp: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('🎬 ProductsApp: Initializing...');
    
    // Subscribe to auth events
    const subscription = eventBus.onAuth().subscribe((event: any) => {
      console.log('📥 ProductsApp: Received auth event:', event.type, event.payload);
      
      // Ignore REQUEST_STATE events (these are from other MFs)
      if (event.payload === 'REQUEST_STATE') {
        return;
      }
      
      switch (event.type) {
        case 'LOGIN':
          setUserData(event.payload.userData);
          setToken(event.payload.token);
          setIsReady(true);
          break;
        case 'LOGOUT':
          setUserData(null);
          setToken(null);
          setIsReady(false);
          break;
        case 'AUTH_STATE_CHANGE':
          if (event.payload && event.payload.token) {
            setUserData(event.payload.userData);
            setToken(event.payload.token);
            setIsReady(true);
          } else if (event.payload && !event.payload.token) {
            // No token yet, but we got the state
            setIsReady(true);
          }
          break;
      }
    });

    // Request current auth state on mount
    // setTimeout(() => {
      console.log('📤 ProductsApp: Requesting auth state...');
      eventBus.emit({ type: 'AUTH_STATE_CHANGE', payload: 'REQUEST_STATE' });
    // }, 50);

    return () => subscription.unsubscribe();
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return (
      <div>
        <h2>Products</h2>
        <p>Please log in to view products</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Products</h2>
      {userData && <p>Welcome, {userData.name}!</p>}
      <ProductsList token={token}/>
    </div>
  );
};

export default ProductsApp;