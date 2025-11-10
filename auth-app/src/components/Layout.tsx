import { Link, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateUserData } from '../store/authSlice';
import type { RootState } from '../store';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userData} = useSelector((state:RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleGenerateUsername = () => {
    const randomName = 'User' + Math.floor(Math.random() * 1000);
    dispatch(updateUserData(randomName));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '200px',
        backgroundColor: '#343a40',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{ marginBottom: '2rem' }}>Welcome {userData?.name}</h3>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            marginBottom: '1rem',
            padding: '0.5rem',
            borderRadius: '4px',
            display: 'block'
          }}
        >
          Home
        </Link>
        <Link
          to="/cart"
          style={{
            color: 'white',
            textDecoration: 'none',
            marginBottom: '1rem',
            padding: '0.5rem',
            borderRadius: '4px',
            display: 'block'
          }}
        >
          Cart
        </Link>
        <button
          onClick={handleGenerateUsername}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Generate New Username
        </button>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            padding: '0.5rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
        backgroundColor: '#f8f9fa',
        overflow: 'auto'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;