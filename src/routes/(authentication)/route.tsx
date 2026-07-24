import { useAuth } from '@/stores/auth-store'
import { useAuthCheck } from '@/hooks/use-auth-check'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(authentication)')({
  component: RouteComponent,
})

function RouteComponent() {
  const { role, isLoading } = useAuth()
  useAuthCheck()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p>로딩 중...</p>
      </div>
    )
  }

  if (role === null) return <Navigate to={'/login'} replace />

  return <Outlet />
}
