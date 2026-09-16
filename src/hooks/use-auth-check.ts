import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { checkAuth } from '@/api/auth'
import { useEffect } from 'react'

export function useAuthCheck() {
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
  const setLoading = useAuthStore((s) => s.setLoading)
  const setAuthRole = useAuthStore((s) => s.setAuthRole)

  const { data: authenticated, isLoading: queryLoading } = useQuery({
    queryKey: ['auth', 'check'],
    queryFn: checkAuth,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  useEffect(() => {
    setLoading(queryLoading)
    if (authenticated !== undefined) {
      setAuthenticated(authenticated)
      // me 성공 → user. 실패해도 게스트로 둘러보던 중이면 게스트 유지, 그 외엔 비로그인.
      // role은 getState로 읽어 deps에 넣지 않는다(리렌더 루프 방지).
      const currentRole = useAuthStore.getState().role
      setAuthRole(
        authenticated ? 'user' : currentRole === 'guest' ? 'guest' : null,
      )
    }
  }, [authenticated, queryLoading, setAuthenticated, setLoading, setAuthRole])

  return { authenticated, isLoading: queryLoading }
}
