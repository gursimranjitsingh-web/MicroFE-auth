import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

function App() {
  const [cartItems, setCartItems] = useState<Product[]>([]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      // Check if product already exists
      const existing = prev.find(item => item.id === product.id);
      if (!existing) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Layout cartItems={cartItems} /></ProtectedRoute>}>
          <Route index element={<Home cartItems={cartItems} onAddToCart={handleAddToCart} />} />
          <Route path="cart" element={<Cart cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onClearCart={handleClearCart} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
