import { apiClient } from '@/lib/api-client'
import { API_BASE_URL, APP_ORIGIN } from '@/constants/api'

export function startKakaoLogin() {
  const redirectUri = `${APP_ORIGIN}/login-success`
  const loginUrl = new URL('/api/auth/kakao', API_BASE_URL)

  loginUrl.searchParams.set('redirectUri', redirectUri)
  window.location.assign(loginUrl.toString())
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
