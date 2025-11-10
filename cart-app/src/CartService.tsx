import { Provider } from 'react-redux';
import { store } from './store';

interface CartServiceProps {
  children: React.ReactNode;
}

const CartService = ({ children }: CartServiceProps) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default CartService;