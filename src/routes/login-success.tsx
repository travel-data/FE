import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useEffect } from 'react'

export const Route = createFileRoute('/login-success')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { setAuthRole, setAuthenticated } = useAuthStore()

  useEffect(() => {
    setAuthRole('user')
    setAuthenticated(true)

    setTimeout(() => {
      navigate({ to: '/' })
    }, 500)
  }, [navigate, setAuthRole, setAuthenticated])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-body1">로그인 성공! 잠시만 기다려주세요...</p>
    </div>
  )
}
