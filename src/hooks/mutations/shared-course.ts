import { verifySharedPassword } from '@/api/shared-course'
import { QUERY_KEY } from '@/constants/query-key'
import { queryClient } from '@/lib/query-client'
import { setSharedToken } from '@/lib/shared-course-token'
import { useMutation } from '@tanstack/react-query'

// 공유 코스 비밀번호 검증. 성공 시 접근 토큰을 저장하고 공개 상세 쿼리를 무효화해
// 곧바로 조회가 시작되게 한다.
export function useVerifySharedPassword(courseId: string) {
  return useMutation({
    mutationFn: (password: string) => verifySharedPassword(courseId, password),
    onSuccess: (data) => {
      // ponytail: 백엔드 임시 대응 — 공유 중단된 코스는 verified=true인데 accessToken이
      // null로 온다. 토큰이 없으면 저장하지 않아 호출부에서 접근 불가로 처리하게 둔다.
      if (!data.verified || !data.accessToken) return
      setSharedToken(courseId, data.accessToken)
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.course.shared(courseId),
      })
    },
  })
}
