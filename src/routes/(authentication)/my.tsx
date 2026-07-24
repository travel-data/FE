import { logout as requestLogout } from '@/api/auth'
import BottomNavBar from '@/components/layout/bottom-nav-bar'
import TopBar from '@/components/layout/top-bar'
import { useAuthStore } from '@/stores/auth-store'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/(authentication)/my')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)
  const setLoading = useAuthStore((state) => state.setLoading)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await requestLogout()
    } finally {
      logout()
      setLoading(false)
      queryClient.removeQueries({ queryKey: ['auth'] })
      navigate({ to: '/login', replace: true })
    }
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar title="마이페이지" />

      <main className="flex-1 overflow-y-auto px-5 pb-24">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full py-4 text-left text-body1 text-text-heading disabled:opacity-50"
        >
          로그아웃
        </button>
      </main>

      <BottomNavBar />
    </div>
  )
}
