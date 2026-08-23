import { apiClient } from '@/lib/api-client'
import { API_BASE_URL } from '@/constants/api'

export function startKakaoLogin() {
  const redirectUrl = `${window.location.origin}/login-success`
  const searchParams = new URLSearchParams({ redirectUrl })

  window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao?${searchParams.toString()}`
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
