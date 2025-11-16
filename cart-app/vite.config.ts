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
        name: 'cartApp',
        filename: 'remoteEntry.js',
        remotes: {
          authApp: env.VITE_AUTH_APP_URL,
          ui: env.VITE_UI_URL,
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
      rollupOptions: {
        external: [
          'ui/styles/datepicker',
          'ui/styles/modal',
          'ui/styles/table',
        ],
      },
    },
    preview: {
      port: 5175,
    },
  }
})
