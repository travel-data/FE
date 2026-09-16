import axios from 'axios'
import { API_BASE_URL } from '@/constants/api'

// 공유 코스 조회 전용 인스턴스.
// 비로그인 접근이 전제라 쿠키 인증(withCredentials)과 401 refresh 리다이렉트 로직을
// 의도적으로 두지 않는다. (apiClient의 refresh 인터셉터를 타면 /login으로 튕김)
export const sharedCourseClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
})
