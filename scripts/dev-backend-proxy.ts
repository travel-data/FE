import type { ProxyOptions } from 'vite'

export function createBackendProxy(target: string): ProxyOptions {
  return {
    target,
    changeOrigin: true,
    configure(proxy) {
      proxy.on('proxyRes', (proxyResponse) => {
        const cookies = proxyResponse.headers['set-cookie']
        if (!cookies) return

        // Production cookies are HTTPS-only. Adapt them only in the local
        // development proxy; keep their host-only and HttpOnly attributes.
        proxyResponse.headers['set-cookie'] = cookies.map((cookie) =>
          cookie
            .replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
            .replace(/;\s*Secure(?=;|$)/gi, ''),
        )
      })
    },
  }
}
