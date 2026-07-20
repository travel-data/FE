import { apiClient } from '@/lib/api-client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export function startKakaoLogin() {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/kakao`
}

export async function logout() {
  await apiClient.post('/api/auth/logout')
}

export async function checkAuth(): Promise<boolean> {
  try {
    await apiClient.post('/api/auth/refresh')
    return true
  } catch {
    return false
  }
}
