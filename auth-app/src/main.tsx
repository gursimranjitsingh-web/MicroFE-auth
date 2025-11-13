import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import './index.css'
import App from './App.tsx'
// Initialize services
import './services/authService'
import './services/cartService'
// import { ApolloProvider } from "@apollo/client"
// import client from "./apollo/index.ts"

createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <ApolloProvider client={client}> */}
          <App />
        {/* </ApolloProvider> */}
      </PersistGate>
    </Provider>
  </>,
)
