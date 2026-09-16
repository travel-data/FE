import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { checkAuth } from '@/api/auth'
import { takeAuthReturnUrl } from '@/lib/auth-return-url'

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

      if (!authenticated) {
        navigate({ to: '/login', replace: true })
        return
      }

      // 로그인 유도 시점 화면이 있으면 그리로 복귀, 없으면 홈
      const returnUrl = takeAuthReturnUrl()
      if (returnUrl) {
        window.location.replace(returnUrl)
      } else {
        navigate({ to: '/', replace: true })
      }
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
