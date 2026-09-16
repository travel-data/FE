import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { checkAuth } from '@/api/auth'
import { takeAuthReturnUrl } from '@/lib/auth-return-url'
import LogoSymbol from '@/assets/icons/symbol.svg?react'

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
      <LogoSymbol
        aria-label="OISO 로고"
        className="animate-pulse translate-y-[clamp(-16px,calc(8svh-59.2px),16px)] transition-transform duration-300"
        height={100}
        role="img"
        width={100}
      />
    </div>
  )
}
