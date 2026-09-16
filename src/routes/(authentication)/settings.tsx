import { logout as requestLogout } from '@/api/auth'
import ConfirmModal from '@/components/modal/confirm-modal'
import { Button } from '@/components/ui/button'
import TopBar from '@/components/layout/top-bar'
import { useAuthStore } from '@/stores/auth-store'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeft, Square, SquareCheckBig } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/(authentication)/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation(['common', 'auth'])
  const router = useRouter()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logout = useAuthStore((state) => state.logout)
  const setLoading = useAuthStore((state) => state.setLoading)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isWithdrawChecked, setIsWithdrawChecked] = useState(false)

  const handleBack = () => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }

    navigate({ to: '/my' })
  }

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

  const handleWithdrawModalChange = (open: boolean) => {
    setIsWithdrawModalOpen(open)

    if (!open) {
      setIsWithdrawChecked(false)
    }
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar
        title={t('setting.title')}
        leftSlot={
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={handleBack}
            className="flex size-8 items-center justify-center rounded-full text-text-heading transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <ChevronLeft className="size-6" />
          </button>
        }
      />

      <main className="flex-1 overflow-y-auto px-5 pb-24">
        <div className="mt-10">
          <Button
            type="button"
            variant="outline"
            className="w-full border-border-1 bg-white text-text-heading hover:border-border-1 hover:bg-gray-50 hover:text-text-heading active:bg-gray-100"
            onClick={() => setIsLogoutModalOpen(true)}
            disabled={isLoggingOut}
          >
            {t('auth:button.logout')}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="mt-8 w-full border-border-1 bg-white text-text-heading hover:border-border-1 hover:bg-gray-50 hover:text-text-heading active:bg-gray-100"
            onClick={() => setIsWithdrawModalOpen(true)}
          >
            {t('auth:button.withdraw_account')}
          </Button>
        </div>
      </main>

      <ConfirmModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
        title={t('auth:confirm.logout')}
        actionLabel={t('auth:button.logout')}
        onAction={handleLogout}
      />

      <ConfirmModal
        open={isWithdrawModalOpen}
        onOpenChange={handleWithdrawModalChange}
        title={t('auth:confirm.withdraw_title')}
        actionLabel={t('auth:button.withdraw')}
        actionDisabled={!isWithdrawChecked}
        onAction={() => undefined}
      >
        <button
          type="button"
          className="mb-2 flex w-full items-center justify-center gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
          onClick={() => setIsWithdrawChecked((checked) => !checked)}
        >
          {isWithdrawChecked ? (
            <SquareCheckBig className="size-6 shrink-0 text-brand-primary" />
          ) : (
            <Square className="size-6 shrink-0 text-text-subdued" />
          )}
          <span className="text-label text-text-subdued">
            {t('auth:confirm.withdraw_description')}
          </span>
        </button>
      </ConfirmModal>
    </div>
  )
}
