import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import { checkAuth } from '@/api/auth'
import { useEffect } from 'react'

export function useAuthCheck() {
  const { setAuthenticated, setLoading, setAuthRole } = useAuthStore()

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
      setAuthRole(authenticated ? 'user' : null)
    }
  }, [authenticated, queryLoading, setAuthenticated, setLoading, setAuthRole])

  return { authenticated, isLoading: queryLoading }
}
