import { Navigate } from '@tanstack/react-router'

import { PhoneShell } from '@/components/mobile'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/api-client'
import { useAuthCheck } from '@/hooks/use-auth-check'
import { useAuthStore } from '@/stores/auth-store'

export default function HomePage() {
  useAuthCheck()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)
  const resetAuth = useAuthStore((state) => state.resetAuth)

  const handleLogout = async () => {
    await logout()
    resetAuth()
    window.location.assign('/login')
  }

  if (isLoading) {
    return (
      <PhoneShell>
        <main className="flex min-h-svh items-center justify-center px-6 text-center">
          <p className="text-body1 text-text-default">로그인 확인 중입니다.</p>
        </main>
      </PhoneShell>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <PhoneShell>
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-body1 text-text-default">로그인되었습니다.</p>
        <Button type="button" onClick={handleLogout}>
          로그아웃
        </Button>
      </main>
    </PhoneShell>
  )
}
