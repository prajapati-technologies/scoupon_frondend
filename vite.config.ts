import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: true,
    hmr: true,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/chat': 'http://localhost:3000',
      '/gallery': 'http://localhost:3000',
      '/message': 'http://localhost:3000',
      '/packages': 'http://localhost:3000',
      '/permission': 'http://localhost:3000',
      '/promos': 'http://localhost:3000',
      '/public/uploads': 'http://localhost:3000',
      '/stats': 'http://localhost:3000',
      '/subscribepackage': 'http://localhost:3000',
      '/transactions': 'http://localhost:3000',
      '/user': 'http://localhost:3000',
      '/vendor': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // Only proxy /vendor/badge paths (backend API), not frontend routes
        bypass: (req) => {
          if (req.url && req.url.startsWith('/vendors/')) {
            return req.url; // Don't proxy /vendors/* (frontend routes)
          }
          // Only proxy actual backend API paths
          if (req.url && req.url.startsWith('/vendor/badge')) {
            return; // Let it proxy to backend
          }
          // All other /vendor/* paths are frontend routes
          return req.url;
        }
      },
      '/zipcode': 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
