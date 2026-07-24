import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

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
      refreshPromise ??= apiClient.post('/api/auth/refresh')
      await refreshPromise
      return apiClient(originalRequest)
    } catch (refreshError) {
      window.location.assign('/login')
      return Promise.reject(refreshError)
    } finally {
      refreshPromise = null
    }
  },
)
