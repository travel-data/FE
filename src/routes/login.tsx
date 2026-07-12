import { PhoneShell } from '@/components/mobile'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import GoogleIcon from '@/assets/icons/logo-google.svg?react'
import KakaoIcon from '@/assets/icons/logo-kakao.svg?react'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('auth')

  const navigate = useNavigate()
  const stay = () => navigate({ to: '/login' })

  const { setAuthRole } = useAuthStore()

  return (
    <PhoneShell>
      <main className="flex min-h-svh flex-col px-6 pt-[max(48px,env(safe-area-inset-top))] pb-[calc(34px+env(safe-area-inset-bottom))]">
        <section className="flex flex-1 items-center flex-col justify-center">
          <p className="text-title1 font-bold text-text-heading">로고</p>
        </section>

        <section className="flex flex-col">
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={stay}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[12px] border-[0.5px] border-gray-300 bg-white text-body2 text-black active:bg-gray-100"
            >
              <GoogleIcon />
              {t('button.google')}
            </button>

            <button
              type="button"
              onClick={stay}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[12px] bg-[#FEE500] text-body2 text-black active:opacity-80"
            >
              <KakaoIcon />
              {t('button.kakao')}
            </button>
          </div>

          <Divider />

          <Button
            className="h-14"
            variant={'outline'}
            type="button"
            onClick={() => {
              setAuthRole('guest')
              navigate({ to: '/' })
            }}
          >
            {t('button.guest')}
          </Button>
        </section>
      </main>
    </PhoneShell>
  )
}

function Divider() {
  const { t } = useTranslation('common')

  return (
    <div className=" flex w-full items-center justify-center gap-3 overflow-visibletext-body2 text-gray-400 py-4">
      <span className="h-px w-17.5 shrink-0 bg-gray-300" />
      <span>{t('or')}</span>
      <span className="h-px w-17.5 shrink-0 bg-gray-300" />
    </div>
  )
}
