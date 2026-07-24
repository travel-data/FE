import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

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
    navigate({ to: '/', replace: true })
  }, [navigate, setAuthRole, setAuthenticated, setLoading])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-body1">로그인 성공! 잠시만 기다려주세요...</p>
    </div>
  )
}
