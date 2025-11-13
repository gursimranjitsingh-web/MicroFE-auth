// import { ApolloProvider } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import './App.css'
import ProductsApp from './ProductsApp'
import apololink from 'authApp/apollo';

function App() {
  console.log(apololink,'apololink--in-products-app')
  return (
    <>
    <ApolloProvider client={apololink}>
      <ProductsApp  />
    </ApolloProvider>
    </>
  )
}

export default App
