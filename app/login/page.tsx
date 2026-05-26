'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-screen bg-white px-6 pt-14 pb-12">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.push('/onboarding')}
        className="self-start p-1 -ml-1 text-text-heading active:text-text-subdued transition-colors"
      >
        <ChevronLeft size={32} strokeWidth={2} />
      </button>

      {/* 로고 — 화면 중앙 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display1 text-text-heading">LOGO</h1>
          <p className="text-body2 text-text-subdued mt-1">경주를 더 어쩌구하게</p>
        </div>
      </div>

      {/* 소셜 로그인 버튼 */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => router.push('/home')}
          className="w-full py-4 rounded-2xl bg-[#FEE500] text-[#191919] text-title3 flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
        >
          카카오 로그인
        </button>

        <button
          onClick={() => router.push('/home')}
          className="w-full py-4 rounded-2xl bg-bg-card border border-border-1 text-text-heading text-title3 flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
        >
          구글 로그인
        </button>

        <button
          onClick={() => router.push('/home')}
          className="w-full py-3 text-text-subdued text-body2 text-center mt-1 active:text-text-default transition-colors"
        >
          둘러보기
        </button>
      </div>
    </main>
  )
}
