"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { PhoneShell, Placeholder } from "../components/mobile";

type CourseNote = {
  id: number;
  title: string;
  date: string;
  distance: string;
  duration: string;
};

const INITIAL_NOTES: CourseNote[] = [
  { id: 1, title: "1번코스", date: "26-06-09 - 26-06-09", distance: "8.2km", duration: "5시간 30분" },
  { id: 2, title: "2번코스", date: "26-06-09 - 26-06-09", distance: "8.2km", duration: "5시간 30분" },
  { id: 3, title: "3번코스", date: "26-06-09 - 26-06-09", distance: "8.2km", duration: "5시간 30분" },
  { id: 4, title: "4번코스", date: "26-06-09 - 26-06-09", distance: "8.2km", duration: "5시간 30분" },
  { id: 5, title: "5번코스", date: "26-06-09 - 26-06-09", distance: "8.2km", duration: "5시간 30분" },
];

const TIMELINE = [
  { time: "10:30", place: "첨성대", tag: "관광지", note: "작성한 메모가 표시됩니다." },
  { time: "12:30", place: "카페 황리단", tag: "카페", note: "작성한 메모가 표시됩니다." },
  { time: "15:00", place: "교리김밥 본점", tag: "음식점", note: "작성한 메모가 표시됩니다." },
  { time: "16:30", place: "황남빵", tag: "관광지", note: "작성한 메모가 표시됩니다." },
  { time: "18:00", place: "월정교", tag: "관광지", note: "작성한 메모가 표시됩니다." },
];

export default function TravelNotePage() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [selectedNote, setSelectedNote] = useState<CourseNote | null>(null);

  if (selectedNote) {
    return (
      <PhoneShell className="pb-8">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-bg-main px-4">
          <button
            type="button"
            onClick={() => setSelectedNote(null)}
            aria-label="뒤로가기"
            className="-ml-2 flex h-10 w-10 items-center justify-center text-text-heading"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            aria-label="삭제"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-bg-main text-text-subdued"
          >
            <Trash2 size={16} />
          </button>
        </header>

        <main className="px-4">
          <section>
            <h1 className="text-title3 text-text-heading">신라 야경 코스</h1>
            <p className="mt-1 text-caption text-text-heading">26.06.16 - 26.06.16</p>
            <div className="mt-3 flex gap-2">
              {["경주사", "추천코스", "야경"].map((tag) => (
                <span key={tag} className="rounded-full bg-primary-400 px-3 py-1 text-caption text-white">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                ["총 방문 장소", "5곳"],
                ["총 이동 거리", "6.5km"],
                ["소요시간", "5시간 20분"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[8px] bg-bg-card p-3 text-center">
                  <p className="text-caption text-text-heading">{label}</p>
                  <p className="mt-1 text-caption font-bold text-text-heading">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <div className="flex items-center justify-between">
              <h2 className="text-body2 font-bold text-text-heading">여행 타임라인</h2>
              <span className="text-caption text-primary-500">전체보기</span>
            </div>
            <div className="mt-3 max-h-[330px] overflow-y-auto pr-1">
              {TIMELINE.map((item) => (
                <article key={`${item.time}-${item.place}`} className="grid grid-cols-[46px_1fr_74px] gap-3 pb-5">
                  <p className="text-caption text-primary-400">{item.time}</p>
                  <div>
                    <span className="rounded-full bg-primary-400 px-2 py-1 text-caption text-white">
                      {item.tag}
                    </span>
                    <h3 className="mt-2 text-body2 font-bold text-text-heading">{item.place}</h3>
                    <p className="mt-1 text-caption text-text-heading">{item.note}</p>
                    <div className="mt-1 flex gap-3 text-caption text-text-subdued">
                      <span>사진 0개</span>
                      <span>메모</span>
                    </div>
                  </div>
                  <Placeholder className="h-[64px] w-[64px] text-caption" />
                </article>
              ))}
            </div>
          </section>

          <section className="mt-4 border-t border-border-1 pt-4">
            <h2 className="text-body2 font-bold text-text-heading">저장한 스토리카드</h2>
            <div className="mt-3 space-y-3">
              {["첨성대 별을 읽던 신라의 탑", "첨성대 별을 읽던 신라의 탑"].map((title, index) => (
                <article key={`${title}-${index}`} className="grid grid-cols-[72px_1fr] gap-3">
                  <Placeholder className="h-[72px] w-[72px] text-caption" />
                  <div className="flex items-center">
                    <p className="text-label font-bold text-text-heading">{title}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </PhoneShell>
    );
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
        <h1 className="text-body2 font-bold text-text-heading">여행 노트</h1>
        <span className="h-10 w-10" />
      </header>

      <main className="space-y-3 px-4">
        {notes.map((note) => (
          <article key={note.id} className="flex h-[76px] items-center gap-3 rounded-[8px] bg-bg-card p-2">
            <button
              type="button"
              onClick={() => setSelectedNote(note)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <Placeholder className="h-[56px] w-[56px] shrink-0 text-caption" />
              <span className="min-w-0 flex-1">
                <span className="block text-body2 font-bold text-text-heading">{note.title}</span>
                <span className="mt-1 block text-caption text-text-subdued">{note.date}</span>
                <span className="block text-caption text-text-subdued">
                  {note.distance} · {note.duration}
                </span>
              </span>
            </button>
            <button
              type="button"
              aria-label={`${note.title} 삭제`}
              onClick={() => setNotes((prev) => prev.filter((item) => item.id !== note.id))}
              className="flex h-9 w-9 items-center justify-center text-text-subdued"
            >
              <Trash2 size={16} />
            </button>
          </article>
        ))}
      </main>
    </PhoneShell>
  );
}
