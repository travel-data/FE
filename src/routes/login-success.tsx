import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { takeAuthReturnUrl } from '@/lib/auth-return-url'

export const Route = createFileRoute('/login-success')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { setAuthRole, setAuthenticated, setLoading } = useAuthStore()

  useEffect(() => {
    setAuthRole('user')
    setAuthenticated(true)
    setLoading(false)
    // 로그인 유도 시점 화면이 있으면 그리로 복귀, 없으면 홈
    const returnUrl = takeAuthReturnUrl()
    if (returnUrl) {
      window.location.replace(returnUrl)
    } else {
      navigate({ to: '/', replace: true })
    }
  }, [navigate, setAuthRole, setAuthenticated, setLoading])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-body1">로그인 성공! 잠시만 기다려주세요...</p>
    </div>
  )
}
