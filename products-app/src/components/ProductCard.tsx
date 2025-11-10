import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

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
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
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
        style={{
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;