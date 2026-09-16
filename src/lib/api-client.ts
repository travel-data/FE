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
    // /api/auth/me도 refresh를 시도해 로그인을 유지한다(액세스 토큰만 만료된 경우 재발급).
    // 단 refresh까지 실패하면(진짜 비로그인) 강제 리다이렉트 없이 조용히 실패시킨다.
    const isAuthCheckRequest = requestUrl.includes('/api/auth/me')

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
      // refresh가 혹시 응답하지 않아도 멈추지 않도록 timeout으로 방어
      refreshPromise ??= apiClient.post('/api/auth/refresh', undefined, {
        timeout: 10000,
      })
      await refreshPromise
      return apiClient(originalRequest)
    } catch (refreshError) {
      // me(auth check)는 조용히 실패(비로그인 처리). 그 외 요청만 로그인 페이지로 유도.
      if (!isAuthCheckRequest && window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
      return Promise.reject(refreshError)
    } finally {
      refreshPromise = null
    }
  },
)
