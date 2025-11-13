import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'
import { useCcMe } from "./gql/auth";

const Cart = lazy(() => import('cartApp/Cart'));

function App() {
  const {fetcher,loading} = useCcMe()

  console.log(loading,'loading--app')

  useEffect(()=>{
    fetcher();
  },[])

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="cart" element={<Suspense fallback={<div>Loading Cart...</div>}><Cart /></Suspense>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
