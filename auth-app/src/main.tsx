import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import App from './App.tsx'
// Initialize services
import './services/authService'
import './services/cartService'
import { lazy, Suspense } from 'react'
const ThemeProvider = lazy(() => import('ui/ThemeProvider'))
// import { ApolloProvider } from "@apollo/client"
// import client from "./apollo/index.ts"

createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<div>Loading Theme...</div>}>
          <ThemeProvider>
            {/* <ApolloProvider client={client}> */}
            <App />
            {/* </ApolloProvider> */}
          </ThemeProvider>
        </Suspense>
      </PersistGate>
    </Provider>
  </>,
)
