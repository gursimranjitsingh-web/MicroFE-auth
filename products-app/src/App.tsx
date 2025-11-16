// import { ApolloProvider } from "@apollo/client";
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ProductsApp from './ProductsApp'
import apololink from 'authApp/apollo'
import { store, persistor } from './store'

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={apololink}>
            <ProductsApp />
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
