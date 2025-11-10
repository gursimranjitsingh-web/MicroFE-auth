import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import type { RootState } from '../store';

const Home = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Welcome Home</h2>
        {userData && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '0.5rem' }}><strong>Name:</strong> {userData.name}</div>
            <div style={{ marginBottom: '0.5rem' }}><strong>Role:</strong> {userData.role}</div>
            <div style={{ marginBottom: '0.5rem' }}><strong>Permissions:</strong> {userData.permissions.join(', ')}</div>
            <div style={{ marginBottom: '0.5rem' }}><strong>Theme:</strong> {userData.theme}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;