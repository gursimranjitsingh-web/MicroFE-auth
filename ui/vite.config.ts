import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'ui',
      filename: 'remoteEntry.js',
      remotes: {
        authApp: 'http://localhost:5000/assets/remoteEntry.js',
      },
      exposes: {
        './ThemeProvider': './src/components/ThemeProvider.tsx',
        './components': './src/components/index.ts',
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
})
