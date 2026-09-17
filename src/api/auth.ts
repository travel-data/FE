import { apiClient } from '@/lib/api-client'

export function startKakaoLogin() {
  window.location.assign(
    `/api/auth/kakao?redirectUri=${encodeURIComponent(
      'https://oiso-fe.vercel.app/login-success',
    )}`,
  )
}

export async function logout() {
  await apiClient.post('/api/auth/logout')
}

export async function checkAuth(): Promise<boolean> {
  try {
    await apiClient.get('/api/auth/me')
    return true
  } catch {
    return false
  }
}
