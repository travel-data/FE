"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PhoneShell } from "../components/mobile";

export default function MyPage() {
  return (
    <PhoneShell>
      <header className="flex h-16 items-center justify-between px-4">
        <Link
          href="/home?trip=active"
          aria-label="뒤로가기"
          className="-ml-2 flex h-10 w-10 items-center justify-center text-text-heading"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-body2 font-bold text-text-heading">마이페이지</h1>
        <span className="h-10 w-10" />
      </header>

      <main className="space-y-3 px-4 pt-4">
        <Link
          href="/travel-note"
          className="flex h-[61px] w-full items-center justify-center rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          여행 노트
        </Link>
        <Link
          href="/memos"
          className="flex h-[61px] w-full items-center justify-center rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          내가 작성한 메모
        </Link>
        <button
          type="button"
          className="flex h-[61px] w-full items-center justify-center rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          저장한 장소
        </button>
        <Link
          href="/story-cards"
          className="flex h-[61px] w-full items-center justify-center rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          저장한 스토리카드
        </Link>
      </main>
    </PhoneShell>
  );
}
