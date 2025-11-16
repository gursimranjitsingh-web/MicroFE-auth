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
        name: 'ui',
        filename: 'remoteEntry.js',
        remotes: {
          authApp: env.VITE_AUTH_APP_URL,
        },
        exposes: {
          './ThemeProvider': './src/components/ThemeProvider.tsx',
          './components': './src/components/index.ts',
          './styles/datepicker': './src/styles/datepicker.ts',
          './styles/modal': './src/styles/modal.ts',
          './styles/table': './src/styles/table.ts',
        },
        shared: [
          'react',
          'react-dom',
          // 'react-redux',
          // '@reduxjs/toolkit',
          // 'redux-persist',
          // 'rxjs',
          // '@apollo/client',
          'antd',
          'sass',
        ],
      }),
    ],
    preview: {
      port: 5888,
    },
  }
})
