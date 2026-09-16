import { PhoneShell } from '@/components/mobile'
import { Button } from '@/components/ui/button'
import { useAuth, useAuthStore } from '@/stores/auth-store'
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { startKakaoLogin } from '@/api/auth'
import { useAuthCheck } from '@/hooks/use-auth-check'

import GoogleIcon from '@/assets/icons/logo-google.svg?react'
import KakaoIcon from '@/assets/icons/logo-kakao.svg?react'
import LogoSymbol from '@/assets/icons/symbol.svg?react'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('auth')
  const { role, isLoading } = useAuth()
  useAuthCheck()

  const navigate = useNavigate()
  const stay = () => navigate({ to: '/login' })

  const { setAuthRole } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <LogoSymbol
          aria-label="OISO 로고"
          className="translate-y-[clamp(-16px,calc(8svh-59.2px),16px)] transition-transform duration-300"
          height={100}
          role="img"
          width={100}
        />
      </div>
    )
  }

  if (role === 'user') {
    return <Navigate to="/" replace />
  }

  return (
    <PhoneShell>
      <main className="flex min-h-svh flex-col px-6 pt-[max(48px,env(safe-area-inset-top))] pb-[calc(34px+env(safe-area-inset-bottom))]">
        <section className="flex flex-1 items-center flex-col justify-center">
          <LogoSymbol
            aria-label="OISO 로고"
            className="translate-y-[clamp(-16px,calc(8svh-59.2px),16px)] transition-transform duration-300"
            height={100}
            role="img"
            width={100}
          />
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
              onClick={startKakaoLogin}
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
