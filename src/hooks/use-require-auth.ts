import { useLocation, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/stores/auth-store'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'
import { setAuthReturnUrl } from '@/lib/auth-return-url'

// 로그인 사용자만 실행 가능한 액션을 감싼다.
// user면 즉시 실행, 게스트/비로그인이면 로그인 유도 모달을 띄우고
// 로그인 후 현재 화면으로 복귀하도록 returnUrl을 저장한다.
export function useRequireAuth() {
  const { role } = useAuth()
  const openConfirm = useConfirmModalStore((s) => s.open)
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('auth')

  return (action: () => void) => {
    if (role === 'user') {
      action()
      return
    }
    openConfirm({
      title: t('login_required_title'),
      description: t('login_required_description'),
      cancelLabel: t('button.close', { ns: 'common' }),
      actionLabel: t('login_button'),
      onAction: () => {
        setAuthReturnUrl(location.href)
        navigate({ to: '/login' })
      },
    })
  }
}
