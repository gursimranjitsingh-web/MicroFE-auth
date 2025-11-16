import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'productsApp',
      filename: 'remoteEntry.js',
      remotes: {
        authApp: 'http://localhost:5000/assets/remoteEntry.js',
        ui: 'http://localhost:5888/assets/remoteEntry.js',
      },
      exposes: {
        './ProductsApp': './src/App.tsx',
      },
      shared: [
        'react',
        'react-dom',
        'react-redux',
        '@reduxjs/toolkit',
        'redux-persist',
        'rxjs',
        '@apollo/client',
      ],
    }),
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      external: ['ui/styles/datepicker', 'ui/styles/modal', 'ui/styles/table'],
    },
  },
  preview: {
    port: 5174,
  },
})
