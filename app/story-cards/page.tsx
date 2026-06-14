"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft } from "lucide-react";
import { PhoneShell, Placeholder } from "../components/mobile";

const STORY_CARDS = [
  { id: 1, place: "첨성대", title: "별을 읽던 신라의 탑" },
  { id: 2, place: "첨성대", title: "별을 읽던 신라의 탑" },
  { id: 3, place: "첨성대", title: "별을 읽던 신라의 탑" },
  { id: 4, place: "첨성대", title: "별을 읽던 신라의 탑" },
];

function Tags() {
  return (
    <div className="mt-3 flex gap-2">
      {["역사", "천문", "야경"].map((tag) => (
        <span key={tag} className="rounded-[6px] bg-primary-400 px-3 py-1 text-caption text-white">
          #{tag}
        </span>
      ))}
    </div>
  );
}

function StoryDetail({ onBack }: { onBack: () => void }) {
  return (
    <PhoneShell>
      <main className="h-dvh overflow-y-auto bg-bg-main">
        <section className="relative flex h-dvh flex-col justify-end bg-gray-300 px-4 pb-12">
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로가기"
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-text-heading"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <p className="text-title3 font-bold text-white/80">첨성대</p>
            <h1 className="mt-1 text-title1 text-white">별을 읽던 신라의 탑</h1>
            <p className="mt-2 text-label text-white/75">첨성대에 담긴 하늘과 왕국의 이야기</p>
          </div>
          <div className="mt-10 flex flex-col items-center text-caption text-text-heading">
            <span>스크롤하여 더 보기</span>
            <ChevronDown size={18} />
          </div>
        </section>

        <section className="relative -mt-20 rounded-t-[28px] bg-bg-main px-6 pb-8 pt-7">
          <h2 className="text-title3 text-text-heading">첨성대</h2>
          <h3 className="mt-1 text-body2 font-bold text-text-heading">별을 읽던 신라의 탑</h3>
          <p className="mt-3 text-label leading-[1.55] text-text-heading">
            신라인들의 천문학과 지혜가 담긴 가장 오래된 천문대
          </p>
          <Tags />

          <article className="mt-4 rounded-[8px] bg-bg-card p-4">
            <h4 className="text-label font-bold text-text-heading">이 장소에서 무엇을 보게 되나요?</h4>
            <p className="mt-2 text-caption leading-[1.6] text-text-heading">
              첨성대는 신라 사람들이 하늘을 관찰하고 시간과 계절의 흐름을 이해하려 했던 장소로 알려져 있습니다.
              이곳에서는 신라가 남긴 과학과 왕경의 분위기를 함께 느낄 수 있습니다.
            </p>
          </article>

          <section className="mt-5">
            <h4 className="text-body2 font-bold text-text-heading">하늘을 읽는 신라인들</h4>
            <p className="mt-3 text-label leading-[1.75] text-text-heading">
              신라 시대 사람들에게 별은 단순히 아름다운 밤하늘이 아니었습니다.
            </p>
            <p className="mt-3 text-label leading-[1.75] text-text-heading">
              별의 움직임은 농사의 때를 알려주고, 나라의 중요한 결정을 해석하는 단서가 되기도 했습니다.
            </p>
            <p className="mt-3 text-label leading-[1.75] text-text-heading">
              첨성대는 그 하늘을 관찰하기 위해 세워진 신라의 상징적인 건축물로 전해집니다.
            </p>
          </section>

          <Placeholder className="mt-5 h-[150px]">사진</Placeholder>

          <section className="mt-6">
            <h4 className="text-body2 font-bold text-text-heading">알고 있었나요?</h4>
            <p className="mt-3 text-label leading-[1.75] text-text-heading">
              첨성대의 돌 개수는 신라의 날짜와 연관해 해석되기도 합니다. 이런 상징성 때문에 첨성대는 단순한 건축물이 아니라
              신라의 시간관을 보여주는 장소로 이야기됩니다.
            </p>
            <div className="mt-5 rounded-[8px] bg-primary-200 p-4">
              <p className="text-caption leading-[1.6] text-primary-900">
                첨성대는 해가 진 뒤 조명이 켜졌을 때 가장 선명하게 분위기가 살아납니다.
                경주 야경 코스를 걷는다면 저녁 시간에 방문해보세요.
              </p>
            </div>
          </section>
        </section>
      </main>
    </PhoneShell>
  );
}

export default function StoryCardsPage() {
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  if (selectedCardId) {
    return <StoryDetail onBack={() => setSelectedCardId(null)} />;
  }

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
        <h1 className="text-body2 font-bold text-text-heading">저장한 스토리카드</h1>
        <span className="h-10 w-10" />
      </header>

      <main className="space-y-5 px-4 pt-4">
        {STORY_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setSelectedCardId(card.id)}
            className="grid w-full grid-cols-[72px_1fr] gap-4 text-left"
          >
            <Placeholder className="h-[72px] w-[72px] text-caption" />
            <span className="flex flex-col justify-center">
              <span className="text-body2 font-bold text-text-heading">{card.place}</span>
              <span className="mt-1 text-label text-text-heading">{card.title}</span>
            </span>
          </button>
        ))}
      </main>
    </PhoneShell>
  );
}
