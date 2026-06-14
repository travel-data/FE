"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, GripHorizontal, Minus, Star } from "lucide-react";
import { PhoneShell, Placeholder } from "../components/mobile";

type Place = {
  id: number;
  name: string;
  summary: string;
  distance: string;
  description: string;
  checklist: { label: string; status: string; tone: "good" | "warn" }[];
};

const PLACES: Place[] = [
  {
    id: 1,
    name: "첨성대",
    summary: "한줄소개한줄소개한줄소개 개행한줄소개한줄소개...",
    distance: "현재 위치에서 12분",
    description:
      "경주 첨성대는 신라 선덕여왕 때 세워진 아시아에서 가장 오래된 석조 천문 관측 시설입니다. 별을 관측하거나 절기를 측정하기 위해 세워진 것으로 추정되며, 신라인들의 뛰어난 과학적, 천문학적 지식을 고스란히 담고 있습니다.",
    checklist: [
      { label: "휠체어 접근", status: "가능", tone: "good" },
      { label: "영유아 동반", status: "가능", tone: "good" },
      { label: "주차", status: "어려움", tone: "warn" },
      { label: "장애인화장실", status: "있음", tone: "good" },
      { label: "반려동물 동반", status: "어려움", tone: "warn" },
      { label: "도보 부담", status: "보통", tone: "warn" },
    ],
  },
  {
    id: 2,
    name: "동궁과 월지",
    summary: "한줄소개",
    distance: "첨성대에서 18분",
    description:
      "동궁과 월지는 신라 왕궁의 별궁터로, 야간 조명과 연못 풍경이 아름다운 대표 야경 명소입니다.",
    checklist: [
      { label: "휠체어 접근", status: "가능", tone: "good" },
      { label: "영유아 동반", status: "가능", tone: "good" },
      { label: "주차", status: "가능", tone: "good" },
      { label: "장애인화장실", status: "있음", tone: "good" },
      { label: "반려동물 동반", status: "어려움", tone: "warn" },
      { label: "도보 부담", status: "보통", tone: "warn" },
    ],
  },
  {
    id: 3,
    name: "월정교",
    summary: "한줄소개",
    distance: "동궁과 월지에서 16분",
    description:
      "월정교는 복원된 신라 시대 교량으로, 강변 산책과 야경 감상에 좋은 장소입니다.",
    checklist: [
      { label: "휠체어 접근", status: "가능", tone: "good" },
      { label: "영유아 동반", status: "가능", tone: "good" },
      { label: "주차", status: "어려움", tone: "warn" },
      { label: "장애인화장실", status: "있음", tone: "good" },
      { label: "반려동물 동반", status: "가능", tone: "good" },
      { label: "도보 부담", status: "보통", tone: "warn" },
    ],
  },
];

function statusClass(tone: "good" | "warn") {
  return tone === "good" ? "bg-status-success text-white" : "bg-status-warning text-white";
}

function PlaceBottomSheet({
  place,
  bookmarked,
  onToggleBookmark,
  onClose,
}: {
  place: Place;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 z-40 bg-black/35"
      />
      <section className="absolute inset-x-0 bottom-0 z-50 max-h-[72dvh] overflow-y-auto rounded-t-[28px] bg-bg-main px-6 pb-6 pt-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-caption text-text-subdued">신라 야경 코스의 첫번째 여정</p>
            <h2 className="text-title3 text-text-heading">{place.name}</h2>
          </div>
          <button
            type="button"
            aria-label={bookmarked ? "북마크 해제" : "북마크"}
            aria-pressed={bookmarked}
            onClick={onToggleBookmark}
            className="flex h-9 w-9 shrink-0 items-center justify-center"
          >
            <Star
              size={22}
              className={bookmarked ? "text-status-warning" : "text-text-heading"}
              fill={bookmarked ? "currentColor" : "none"}
            />
          </button>
        </header>

        <Placeholder className="mt-3 h-[200px]">사진</Placeholder>
        <p className="mt-3 text-caption leading-[1.55] text-text-heading">{place.description}</p>

        <section className="mt-4">
          <h3 className="text-label font-bold text-text-heading">관광지 체크리스트</h3>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-3 rounded-[8px] bg-bg-card p-4">
            {place.checklist.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-2">
                <span className="text-caption text-text-heading">{item.label}</span>
                <span className={`rounded-full px-3 py-1 text-caption ${statusClass(item.tone)}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 h-[52px] w-full rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading active:bg-gray-200"
        >
          닫기
        </button>
      </section>
    </>
  );
}

function CourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "recommended";
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [screen, setScreen] = useState<"course" | "edit" | "add">("course");
  const [coursePlaces, setCoursePlaces] = useState<Place[]>(PLACES);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [shareStep, setShareStep] = useState<"confirm" | "password" | null>(null);
  const [sharePassword, setSharePassword] = useState("");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const movePlace = (fromId: number, toId: number) => {
    setCoursePlaces((prev) => {
      const fromIndex = prev.findIndex((place) => place.id === fromId);
      const toIndex = prev.findIndex((place) => place.id === toId);
      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return prev;

      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const addRecommendedPlace = (place: Place) => {
    setCoursePlaces((prev) => {
      if (prev.some((item) => item.id === place.id)) return prev;
      return [...prev, place];
    });
  };

  if (shareStep === "password") {
    return (
      <PhoneShell>
        <header className="flex h-16 items-center px-4">
          <button
            type="button"
            onClick={() => setShareStep(null)}
            className="flex h-10 items-center text-label text-text-heading"
          >
            <ChevronLeft size={22} />
            뒤로가기
          </button>
        </header>

        <main className="px-4 pt-[72px]">
          <h1 className="text-center text-body2 font-bold text-text-heading">
            2차 비밀번호를 입력해주세요
          </h1>
          <input
            type="password"
            value={sharePassword}
            onChange={(event) => setSharePassword(event.target.value)}
            inputMode="numeric"
            aria-label="2차 비밀번호"
            className="mt-5 h-[52px] w-full rounded-[8px] bg-bg-card px-4 text-center text-body2 text-text-heading outline-none"
          />
        </main>

        <footer className="absolute bottom-4 left-4 right-4">
          <button
            type="button"
            onClick={() => router.push("/home?trip=active")}
            className="h-[61px] w-full rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
          >
            입력완료
          </button>
        </footer>
      </PhoneShell>
    );
  }

  if (screen === "edit") {
    return (
      <PhoneShell className="pb-[92px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-bg-main px-4">
          <button
            type="button"
            onClick={() => setScreen("course")}
            className="-ml-2 flex h-10 w-10 items-center justify-center"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-body2 font-bold text-text-heading">코스 수정하기</h1>
          <button type="button" className="text-label text-text-heading">
            편집
          </button>
        </header>

        <main className="px-4">
          <p className="mb-4 text-center text-caption text-text-heading">
            순서를 변경하거나 장소를 추가/삭제 해보세요
          </p>

          <section className="space-y-3">
            {coursePlaces.map((place) => (
              <article
                key={place.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggingId !== null) movePlace(draggingId, place.id);
                  setDraggingId(null);
                }}
                className="grid min-h-[96px] grid-cols-[24px_48px_1fr_28px] items-center gap-3 rounded-[8px] bg-bg-card p-3"
              >
                <button
                  type="button"
                  onClick={() =>
                    setCoursePlaces((prev) => prev.filter((item) => item.id !== place.id))
                  }
                  aria-label={`${place.name} 삭제`}
                  className="flex h-8 w-6 items-center justify-center text-text-heading"
                >
                  <Minus size={16} />
                </button>
                <span className="h-12 w-12 rounded-[8px] bg-bg-main" />
                <div className="min-w-0">
                  <h2 className="text-title3 text-text-heading">{place.name}</h2>
                  <div className="mt-5 flex items-center gap-2">
                    <span className="h-5 w-5 rounded-[4px] bg-bg-main" />
                    <span className="text-label text-text-heading">
                      {place.id === 1 ? "도보" : place.id === 2 ? "자전거" : "차량"}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  draggable
                  onDragStart={() => setDraggingId(place.id)}
                  onDragEnd={() => setDraggingId(null)}
                  aria-label={`${place.name} 순서 변경`}
                  className="flex h-10 w-8 cursor-grab items-start justify-center pt-3 text-text-subdued active:cursor-grabbing"
                >
                  <GripHorizontal size={18} />
                </button>
              </article>
            ))}
          </section>

          <button
            type="button"
            onClick={() => setScreen("add")}
            className="mt-3 h-[47px] w-full border border-text-heading text-body2 font-bold text-text-heading"
          >
            장소 추가
          </button>

          <section className="mt-4">
            <h2 className="text-title3 text-text-heading">추천 장소 추가</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {["대릉원", "대릉원", "대릉원"].map((label, index) => (
                <button key={`${label}-${index}`} type="button" className="text-left">
                  <span className="block h-[74px] rounded-[4px] bg-bg-card" />
                  <span className="mt-2 block text-body2 font-bold text-text-heading">{label}</span>
                </button>
              ))}
            </div>
          </section>
        </main>

        <footer className="absolute bottom-0 left-4 right-4 z-20 bg-bg-main py-3">
          <button
            type="button"
            onClick={() => setScreen("course")}
            className="h-[61px] w-full rounded-[8px] bg-bg-card text-title3 text-text-heading"
          >
            수정완료
          </button>
        </footer>
      </PhoneShell>
    );
  }

  if (screen === "add") {
    const addablePlaces: Place[] = [
      {
        ...PLACES[0],
        id: 10,
        name: "불국사",
        summary: "추천 장소",
        distance: "약 12분 · 1.2km",
      },
      {
        ...PLACES[1],
        id: 11,
        name: "대릉원",
        summary: "추천 장소",
        distance: "약 12분 · 1.2km",
      },
      {
        ...PLACES[2],
        id: 12,
        name: "황리단길",
        summary: "추천 장소",
        distance: "약 12분 · 1.2km",
      },
    ];

    return (
      <PhoneShell className="pb-[92px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-center bg-bg-main px-4">
          <button
            type="button"
            onClick={() => setScreen("edit")}
            className="absolute left-2 flex h-10 w-10 items-center justify-center"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-body2 font-bold text-text-heading">장소추가</h1>
        </header>

        <main className="px-4">
          <div className="h-11 border border-border-2 bg-bg-main" />

          <section className="mt-4">
            <h2 className="text-title3 text-text-heading">추천 장소 추가</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {["대릉원", "대릉원", "대릉원"].map((label, index) => (
                <button key={`${label}-${index}`} type="button" className="text-left">
                  <span className="block h-[74px] rounded-[4px] bg-bg-card" />
                  <span className="mt-2 block text-body2 font-bold text-text-heading">{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-title3 text-text-heading">주변 장소</h2>
              <button type="button" className="text-body2 font-bold text-text-heading">
                내 위치
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {addablePlaces.map((place) => (
                <article key={place.id} className="flex items-center gap-3">
                  <span className="h-[52px] w-[52px] shrink-0 rounded-[8px] bg-bg-card" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-title3 text-text-heading">{place.name}</h3>
                    <p className="mt-1 text-caption text-text-heading">약 12분 · 1.2km</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addRecommendedPlace(place)}
                    className="px-2 text-label text-text-heading"
                  >
                    추가
                  </button>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="absolute bottom-0 left-4 right-4 z-20 bg-bg-main py-3">
          <button
            type="button"
            onClick={() => setScreen("course")}
            className="h-[61px] w-full rounded-[8px] bg-bg-card text-title3 text-text-heading"
          >
            수정완료
          </button>
        </footer>
      </PhoneShell>
    );
  }

  return (
    <PhoneShell className="pb-[104px]">
      <main className="px-4 pt-8">
        <section className="text-center">
          <h1 className="text-body2 font-bold text-text-heading">
            OISO가 추천하는 관광 코스예요
          </h1>
          <p className="mt-2 text-caption text-text-heading">
            지금 추천된 코스는 여행 중 유동적으로 바꿀 수 있어요
          </p>
        </section>

        <Placeholder className="mt-3 h-[202px] rounded-[8px] whitespace-pre-line text-body2 text-text-heading">
          {"지도영역\n\n사용자의 현재 위치\n코스 순서 폴리라인\n추천된 장소 마커"}
        </Placeholder>

        <section className="mt-3">
          <p className="text-body2 font-bold text-text-heading">신라 야경 코스</p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <p className="min-w-0 text-caption text-text-heading">
            {coursePlaces.map((place) => place.name).join(" → ")}
            </p>
            <p className="shrink-0 text-caption text-text-heading">120분소요</p>
          </div>
        </section>

        <section className="mt-3">
          {coursePlaces.map((place, index) => (
            <div key={place.id} className="grid grid-cols-[26px_1fr] gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-caption font-bold ${
                    index === 0 ? "bg-primary-400 text-white" : "bg-primary-100 text-primary-500"
                  }`}
                >
                  {place.id}
                </span>
                {index < PLACES.length - 1 && <span className="my-1 h-[74px] w-px bg-primary-300" />}
              </div>

              <button
                type="button"
                onClick={() => setSelectedPlace(place)}
                className="mb-3 flex h-[84px] min-w-0 items-center gap-3 rounded-[8px] bg-bg-card p-2 text-left active:opacity-80"
              >
                <div className="min-w-0 flex-1 px-1">
                  <h2 className="text-body2 font-bold text-text-heading">{place.name}</h2>
                  <p className="mt-2 line-clamp-2 text-caption leading-[1.45] text-text-heading">
                    {place.summary}
                  </p>
                </div>
                <Placeholder className="h-[68px] w-[60px] shrink-0 bg-bg-main text-caption" />
              </button>
            </div>
          ))}
        </section>

        {mode === "manual" && (
          <button
            type="button"
            onClick={() => router.push("/course/traveler-info")}
            className="mt-1 h-11 w-full rounded-[8px] bg-bg-card text-label font-bold text-text-heading"
          >
            입력 조건 다시 수정하기
          </button>
        )}
      </main>

      <footer className="absolute bottom-0 left-4 right-4 z-20 grid h-[61px] grid-cols-3 gap-[6px] bg-bg-main">
        <button
          type="button"
          onClick={() => setShareStep("confirm")}
          className="rounded-[8px] bg-bg-card text-label font-bold text-text-heading"
        >
          코스 공유하기
        </button>
        <button
          type="button"
          onClick={() => setScreen("edit")}
          className="rounded-[8px] bg-bg-card text-label font-bold text-text-heading"
        >
          코스 수정하기
        </button>
        <button
          type="button"
          onClick={() => router.push("/home?trip=active")}
          className="rounded-[8px] bg-primary-400 text-label font-bold text-white"
        >
          여행 시작하기
        </button>
      </footer>

      {selectedPlace && (
        <PlaceBottomSheet
          place={selectedPlace}
          bookmarked={bookmarks.has(selectedPlace.id)}
          onToggleBookmark={() => toggleBookmark(selectedPlace.id)}
          onClose={() => setSelectedPlace(null)}
        />
      )}
      {shareStep === "confirm" && (
        <>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setShareStep(null)}
            className="absolute inset-0 z-40 bg-black/35"
          />
          <section className="absolute left-8 right-8 top-[45%] z-50 -translate-y-1/2 rounded-[16px] bg-bg-main p-4 text-center">
            <h2 className="mt-5 text-body2 font-bold text-text-heading">코스 공유하기</h2>
            <p className="mt-8 text-caption text-text-subdued">
              관광 코스를 공유하면
              <br />
              다른 사람이 코스를 수정 할 수 있어요
            </p>
            <div className="mt-6 grid h-[52px] grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShareStep(null)}
                className="rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => setShareStep("password")}
                className="rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
              >
                확인
              </button>
            </div>
          </section>
        </>
      )}
    </PhoneShell>
  );
}

export default function CoursePage() {
  return (
    <Suspense>
      <CourseContent />
    </Suspense>
  );
}
