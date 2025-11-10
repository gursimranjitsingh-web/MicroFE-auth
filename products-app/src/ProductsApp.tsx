import { Provider } from 'react-redux';
import { store } from './store';
import ProductsList from './components/ProductsList';

interface UserData {
  name: string;
  role: string;
  permissions: string[];
  theme: string;
}

interface ProductsAppProps {
  token?: string | null;
  userData?: UserData | null;
}

const ProductsApp = ({ token, userData }: ProductsAppProps) => {
  return (
    <Provider store={store}>
      <div>
        <h2>Products</h2>
        {userData && <p>Welcome, {userData.name}!</p>}
        {token && <ProductsList token={token} />}
      </div>
    </Provider>
  );
};

export default ProductsApp;