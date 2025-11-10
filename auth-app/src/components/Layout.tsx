import { Link, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
        <h3 style={{ marginBottom: '2rem' }}>Menu</h3>
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
        backgroundColor: '#f8f9fa'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;