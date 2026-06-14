"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PhoneShell } from "../components/mobile";

const MEMOS = [
  { id: 1, place: "첨성대", type: "메모", date: "26.06.10", hasPhoto: false },
  { id: 2, place: "첨성대", type: "메모", hasPhoto: true },
  { id: 3, place: "첨성대", type: "메모", hasPhoto: false },
  { id: 4, place: "첨성대", type: "메모", hasPhoto: true },
];

const PHOTO_GROUPS = [
  { id: 1, category: "관광지", place: "첨성대", count: 2 },
  { id: 2, category: "관광지", place: "동궁과 월지", count: 1 },
  { id: 3, category: "카페", place: "카페 황리단", count: 2 },
];

export default function MemosPage() {
  return (
    <PhoneShell>
      <header className="flex h-16 items-center justify-between px-4">
        <Link
          href="/mypage"
          aria-label="뒤로가기"
          className="-ml-2 flex h-10 w-10 items-center justify-center text-text-heading"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-body2 font-bold text-text-heading">내가 작성한 메모</h1>
        <span className="h-10 w-10" />
      </header>

      <main className="space-y-5 px-4 pb-8 pt-3">
        <section className="space-y-3">
          {MEMOS.map((memo) => (
            <article
              key={memo.id}
              className="rounded-[16px] bg-bg-card p-4"
            >
              <p className="text-caption text-text-subdued">{memo.type}</p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <h2 className="text-body2 font-bold text-text-heading">{memo.place}</h2>
                  {memo.date && (
                    <p className="mt-1 text-caption text-text-subdued">{memo.date}</p>
                  )}
                </div>
                {memo.hasPhoto && (
                  <div className="flex gap-2">
                    <span className="h-14 w-14 rounded-[6px] bg-white" />
                    <span className="h-14 w-14 rounded-[6px] bg-white" />
                  </div>
                )}
              </div>
            </article>
          ))}
        </section>

        <section>
          <h2 className="text-body2 font-bold text-text-heading">기록된 사진</h2>
          <div className="mt-3 space-y-3">
            {PHOTO_GROUPS.map((group) => (
              <article key={group.id} className="rounded-[16px] bg-bg-card p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary-300 px-2 py-1 text-caption text-white">
                    {group.category}
                  </span>
                  <h3 className="text-body2 font-bold text-text-heading">{group.place}</h3>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {Array.from({ length: group.count }).map((_, index) => (
                    <span key={index} className="block h-[96px] rounded-[4px] bg-white" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PhoneShell>
  );
}
