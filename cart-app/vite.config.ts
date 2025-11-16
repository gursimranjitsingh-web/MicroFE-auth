import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'cartApp',
      filename: 'remoteEntry.js',
      remotes: {
        authApp: 'http://localhost:5000/assets/remoteEntry.js',
        ui: 'http://localhost:5888/assets/remoteEntry.js',
      },
      exposes: {
        './Cart': './src/Cart.tsx',
      },
      shared: [
        'react',
        'react-dom',
        'react-redux',
        '@reduxjs/toolkit',
        'redux-persist',
        'rxjs',
      ],
    }),
  ],
  build: {
    target: 'esnext',
  },
  preview: {
    port: 5175,
  },
})
