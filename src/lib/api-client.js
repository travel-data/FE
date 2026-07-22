import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

let refreshPromise = null

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const requestUrl = originalRequest?.url ?? ''
    const isRefreshRequest = requestUrl.includes('/api/auth/refresh')

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise ??= api.post('/api/auth/refresh')
      await refreshPromise
      return api(originalRequest)
    } catch (refreshError) {
      window.location.assign('/login')
      return Promise.reject(refreshError)
    } finally {
      refreshPromise = null
    }
  },
)

export function startKakaoLogin() {
  window.location.assign(`${API_BASE_URL}/oauth2/authorization/kakao`)
}

export function logout() {
  return api.post('/api/auth/logout')
}
