import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import svgr from 'vite-plugin-svgr'
import tanstackRouter from '@tanstack/router-plugin/vite'
import { createBackendProxy } from './scripts/dev-backend-proxy'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const backendTarget = env.VITE_DEV_BACKEND_URL || 'https://oiso.duckdns.org'
  const backendProxy = createBackendProxy(backendTarget)

  return {
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
      strictPort: true,
      proxy: {
        '/api': backendProxy,
        '/oauth2': backendProxy,
        '/login/oauth2': backendProxy,
        '/tour-image-proxy': {
          target: 'https://tong.visitkorea.or.kr',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tour-image-proxy/, ''),
        },
      },
    },
  }
})
