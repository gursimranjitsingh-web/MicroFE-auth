import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      federation({
        name: 'authApp',
        filename: 'remoteEntry.js',
        remotes: {
          productsApp: env.VITE_PRODUCTS_APP_URL,
          cartApp: env.VITE_CART_APP_URL,
          ui: env.VITE_UI_URL,
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
      rollupOptions: {
        external: [
          'ui/styles/datepicker',
          'ui/styles/modal',
          'ui/styles/table',
        ],
      },
    },
    preview: {
      port: 5000,
    },
  }
})
