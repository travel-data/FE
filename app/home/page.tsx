"use client";

import { useRouter } from "next/navigation";
import { Globe, ChevronRight } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-bg-main">
      {/* 상단 헤더 */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 bg-bg-main">
        <div className="w-10 h-10 bg-brand-primary rounded-xl" />
        <button className="p-2 text-text-subdued">
          <Globe size={22} />
        </button>
      </header>

      {/* 스크롤 콘텐츠 */}
      <main className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">

        {/* 여정 상태 카드 */}
        <div className="bg-bg-card rounded-2xl p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-body2 text-text-heading font-bold leading-snug">
                현재 진행중인 여정이 없어요
              </p>
              <p className="text-label text-text-subdued mt-0.5">
                OISO와 함께 여정을 시작해보세요
              </p>
            </div>
            <div className="shrink-0 w-8 h-8 bg-status-success rounded-full" />
          </div>
          <button
            onClick={() => router.push("/course/traveler-info")}
            className="mt-4 w-full bg-bg-main border border-border-1 text-text-heading text-label font-bold py-3 rounded-full"
          >
            코스 추천 받으러가기
          </button>
        </div>

        {/* 관광카드 */}
        <button className="w-full bg-bg-card rounded-2xl px-4 py-3 flex items-center justify-between">
          <span className="text-body2 text-text-heading font-bold">관광카드</span>
          <ChevronRight size={18} className="text-text-subdued" />
        </button>

        {/* OISO 추천 관광 코스 */}
        <section className="space-y-2">
          <h4 className="text-title3 text-text-heading px-1">OISO가 추천하는 관광 코스</h4>
          <div className="bg-bg-card rounded-2xl aspect-video relative">
            <div className="absolute top-3 right-3 w-8 h-8 bg-status-success rounded-full" />
          </div>
        </section>

        {/* 현재 경주에서 열리고 있는 축제 */}
        <section className="space-y-2">
          <h4 className="text-title3 text-text-heading px-1">현재 경주에서 열리고 있는 축제</h4>
          <div className="bg-bg-card rounded-2xl aspect-video" />
        </section>

      </main>

      {/* 하단 네비게이션 */}
      <nav className="shrink-0 bg-bg-card px-4 py-4 flex items-center justify-center">
        <span className="text-label text-text-subdued">네비게이션 영역</span>
      </nav>
    </div>
  );
}
