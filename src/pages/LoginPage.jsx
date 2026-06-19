import { useNavigate } from '@tanstack/react-router'

import { PhoneShell } from '@/components/mobile'

function Divider() {
  return (
    <div className="flex h-[25px] items-center justify-center gap-3 text-caption text-gray-400">
      <span className="h-px w-[54px] bg-gray-300" />
      <span>또는</span>
      <span className="h-px w-[54px] bg-gray-300" />
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const stay = () => navigate({ to: '/login' })

  return (
    <PhoneShell>
      <main className="flex min-h-svh flex-col px-[clamp(24px,10.7vw,42px)] pt-[max(48px,env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))]">
        <section className="flex flex-1 items-center justify-center">
          <p className="text-title1 font-bold text-text-heading">로고</p>
        </section>

        <section className="flex flex-col gap-2">
          <button
            type="button"
            onClick={stay}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-[8px] border border-gray-200 bg-white text-label font-bold text-[#191919] active:bg-gray-100"
          >
            <span className="text-[18px] font-bold text-[#4285F4]">G</span>
            구글로 시작하기
          </button>

          <button
            type="button"
            onClick={stay}
            className="block h-12 w-full overflow-hidden rounded-[8px] active:opacity-80"
            aria-label="카카오로 시작하기"
          >
            <img
              src="/login/login-kakao.svg"
              alt="카카오로 시작하기"
              className="h-full w-full object-fill"
            />
          </button>

          <Divider />

          <button
            type="button"
            onClick={stay}
            className="h-[46px] w-full rounded-[8px] border border-primary-400 bg-primary-50 text-label font-bold text-primary-500 active:bg-primary-100"
          >
            로그인 없이 둘러보기
          </button>
        </section>
      </main>
    </PhoneShell>
  )
}
