import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { API_BASE_URL } from '@/constants/api'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})

let refreshPromise: Promise<AxiosResponse<unknown>> | null = null

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined
    const status = error.response?.status
    const requestUrl = originalRequest?.url ?? ''
    const isRefreshRequest = requestUrl.includes('/api/auth/refresh')
    // /api/auth/me 401은 "비로그인"이라는 정상 응답 → refresh/리다이렉트 대상 아님
    const isAuthCheckRequest = requestUrl.includes('/api/auth/me')

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isRefreshRequest ||
      isAuthCheckRequest
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      refreshPromise ??= apiClient.post('/api/auth/refresh')
      await refreshPromise
      return apiClient(originalRequest)
    } catch (refreshError) {
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
      return Promise.reject(refreshError)
    } finally {
      refreshPromise = null
    }
  },
)
