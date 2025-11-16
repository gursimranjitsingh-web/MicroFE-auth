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
        ui: 'http://localhost:5888/assets/remoteEntry.js',
      },
      exposes: {
        './eventBus': './src/eventBus/index.ts',
        './apollo': './src/apollo/index.ts',
      },
      shared: [
        'react',
        'react-dom',
        'react-redux',
        '@reduxjs/toolkit',
        'redux-persist',
        'rxjs',
        '@apollo/client',
        'antd',
        'sass',
      ],
    }),
  ],
  build: {
    target: 'esnext',
  },
  preview: {
    port: 5000,
  },
})
