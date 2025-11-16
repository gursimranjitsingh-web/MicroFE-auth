import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Dynamically import styles from UI module
import('ui/styles/datepicker').catch((err) =>
  console.warn('Failed to load datepicker styles:', err),
)

createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)
