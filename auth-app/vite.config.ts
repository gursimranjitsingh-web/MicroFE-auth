import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'authApp',
      filename: 'remoteEntry.js',
      remotes: {
        productsApp: 'http://localhost:5174/assets/remoteEntry.js',
        cartApp: 'http://localhost:5175/assets/remoteEntry.js',
      },
      exposes: {
        './AuthProvider': './src/context/AuthContext.tsx',
        './CartProvider': './src/context/CartContext.tsx',
        './useAuth': './src/context/AuthContext.tsx',
        './useCart': './src/context/CartContext.tsx',
      },
      shared: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit', 'redux-persist'],
    }),
  ],
  build: {
    target: 'esnext',
  },
  preview:{
    port:5000
  }
})
