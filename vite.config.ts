import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import svgr from 'vite-plugin-svgr'
import tanstackRouter from '@tanstack/router-plugin/vite'
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    svgr(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://oiso.duckdns.org',
        changeOrigin: true,
      },
      '/oauth2': {
        target: 'https://oiso.duckdns.org',
        changeOrigin: true,
      },
      '/login/oauth2': {
        target: 'https://oiso.duckdns.org',
        changeOrigin: true,
      },
      '/tour-image-proxy': {
        target: 'https://tong.visitkorea.or.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tour-image-proxy/, ''),
      },
    },
  },
})
