import { getPublicCourse, isSharedAccessError } from '@/api/shared-course'
import { QUERY_KEY } from '@/constants/query-key'
import { useQuery } from '@tanstack/react-query'

// 공유 코스 공개 상세 조회.
// 토큰 없이 먼저 조회 → 공개(featured) 코스는 200, 공유 코스는 403(비번 필요).
// 토큰이 바뀌면(비번 검증 성공) 자동 재조회. 접근 거부(401/403)는 재시도하지 않는다.
export function usePublicCourse(courseId: string, token: string | null) {
  return useQuery({
    queryKey: [...QUERY_KEY.course.shared(courseId), token],
    queryFn: () => getPublicCourse(courseId, token),
    retry: (failureCount, error) => {
      if (isSharedAccessError(error)) return false
      return failureCount < 2
    },
  })
}
