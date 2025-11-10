import { useCart } from 'authApp/CartProvider';
import { useAuth } from 'authApp/AuthProvider';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { cartItems, addToCart } = useCart();
  const { token } = useAuth();

  const isInCart = cartItems.some((item: Product) => item.id === product.id);

  const handleAddToCart = () => {
    if (token) {
      addToCart(product);
    }
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem',
      width: '250px',
      textAlign: 'center'
    }}>
      <img src={product.image} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3 style={{ fontSize: '1rem', margin: '0.5rem 0' }}>{product.title}</h3>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#007bff' }}>${product.price}</p>
      <button
        onClick={handleAddToCart}
        disabled={isInCart || !token}
        style={{
          backgroundColor: isInCart ? '#6c757d' : '#28a745',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: isInCart || !token ? 'not-allowed' : 'pointer'
        }}
      >
        {isInCart ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;