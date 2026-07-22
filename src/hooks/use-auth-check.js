import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'

export function useAuthCheck() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated)
  const setLoading = useAuthStore((state) => state.setLoading)

  const query = useQuery({
    queryKey: ['auth', 'users'],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data
    },
    retry: false,
  })

  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  useEffect(() => {
    if (query.isSuccess) {
      setAuthenticated(true)
      setLoading(false)
    }
  }, [query.isSuccess, setAuthenticated, setLoading])

  useEffect(() => {
    if (query.isError) {
      setAuthenticated(false)
      setLoading(false)
    }
  }, [query.isError, setAuthenticated, setLoading])

  return query
}
