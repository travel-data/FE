import { useAuth } from '@/stores/auth-store'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(authentication)')({
  component: RouteComponent,
})

function RouteComponent() {
  const { role } = useAuth()

  if (role === null) return <Navigate to={'/login'} replace />

  return <Outlet />
}
