import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { LanguageBottomSheet } from '@/components/language-bottom-sheet'
import { PhoneShell } from '@/components/mobile'

function Divider() {
  return (
    <div className="mb-2 flex h-[25px] w-full items-center justify-center gap-3 overflow-visible p-2.5 text-body2 text-gray-400">
      <span className="h-px w-[70px] shrink-0 bg-gray-300" />
      <span>또는</span>
      <span className="h-px w-[70px] shrink-0 bg-gray-300" />
    </div>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [languageSheetOpen, setLanguageSheetOpen] = useState(true)
  const stay = () => navigate({ to: '/login' })

  return (
    <PhoneShell>
      <main className="flex min-h-svh flex-col px-6 pt-[max(48px,env(safe-area-inset-top))] pb-[calc(34px+env(safe-area-inset-bottom))]">
        <section className="flex flex-1 items-center justify-center">
          <p className="text-title1 font-bold text-text-heading">로고</p>
        </section>

        <section className="flex flex-col">
          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={stay}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[12px] border-[0.5px] border-gray-300 bg-white text-body2 text-black active:bg-gray-100"
            >
              <img
                src="/images/icons/logo-google.svg"
                alt=""
                className="h-[18px] w-[18px]"
              />
              구글로 시작하기
            </button>

            <button
              type="button"
              onClick={stay}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-[12px] bg-[#FEE500] text-body2 text-black active:opacity-80"
            >
              <img
                src="/images/icons/logo-kakao.svg"
                alt=""
                className="h-[18px] w-[18px]"
              />
              카카오로 시작하기
            </button>
          </div>

          <Divider />

          <button
            type="button"
            onClick={stay}
            className="h-14 w-full rounded-[8px] border border-primary-400 bg-primary-50 text-body2 text-primary-400 active:bg-primary-100"
          >
            로그인 없이 둘러보기
          </button>
        </section>
      </main>

      <LanguageBottomSheet
        open={languageSheetOpen}
        onClose={() => setLanguageSheetOpen(false)}
      />
    </PhoneShell>
  )
}
