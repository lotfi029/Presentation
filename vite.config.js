import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],

  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: false,
    cors: true,
  },

  preview: {
    port: 4173,
    host: '0.0.0.0',
    historyApiFallback: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }

          return undefined
        },
      },
    },
  },

  define: {
    __APP_VERSION__: JSON.stringify(process.env.VITE_APP_VERSION || '1.0.0'),
  },
})
