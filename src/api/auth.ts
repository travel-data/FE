import { apiClient } from '@/lib/api-client'

export function startKakaoLogin() {
  window.location.assign('/oauth2/authorization/kakao')
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
