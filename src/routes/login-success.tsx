import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { checkAuth } from '@/api/auth'

export const Route = createFileRoute('/login-success')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { setAuthRole, setAuthenticated, setLoading } = useAuthStore()

  useEffect(() => {
    let cancelled = false

    const completeLogin = async () => {
      const authenticated = await checkAuth()
      if (cancelled) return

      setAuthenticated(authenticated)
      setAuthRole(authenticated ? 'user' : null)
      setLoading(false)
      navigate({ to: authenticated ? '/' : '/login', replace: true })
    }

    void completeLogin()

    return () => {
      cancelled = true
    }
  }, [navigate, setAuthRole, setAuthenticated, setLoading])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-body1">로그인 확인 중...</p>
    </div>
  )
}
