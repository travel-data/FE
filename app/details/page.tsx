"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star } from "lucide-react";
import { PhoneShell, Placeholder } from "../components/mobile";

type ChecklistTone = "good" | "warn" | "plain";

type Place = {
  id: number;
  name: string;
  status: string;
  orderLabel: string;
  address: string;
  description: string;
  checklist: { label: string; status: string; tone: ChecklistTone }[];
};

type RestPlace = {
  id: number;
  name: string;
  category: string;
  distance: string;
  address: string;
  description: string;
};

const PLACES: Place[] = [
  {
    id: 1,
    name: "첨성대",
    status: "혼잡",
    orderLabel: "첫번째 코스",
    address: "경상북도 경주시 첨성로 140-25 (인왕동)",
    description:
      "경주 첨성대는 신라 선덕여왕 때 세워진 아시아에서 가장 오래된 석조 천문 관측 시설입니다. 별을 관측하거나 절기를 측정하기 위해 세워진 것으로 추정되며, 신라인들의 뛰어난 과학적, 천문학적 지식을 고스란히 담고 있습니다.",
    checklist: [
      { label: "휠체어 접근", status: "가능", tone: "good" },
      { label: "영유아 동반", status: "가능", tone: "good" },
      { label: "주차", status: "어려움", tone: "warn" },
      { label: "장애인화장실", status: "있음", tone: "good" },
      { label: "반려동물 동반", status: "어려움", tone: "warn" },
      { label: "도보 부담", status: "보통", tone: "plain" },
    ],
  },
  {
    id: 2,
    name: "동궁과 월지",
    status: "보통",
    orderLabel: "두번째 코스",
    address: "경상북도 경주시 원화로 102",
    description:
      "동궁과 월지는 신라 왕궁의 별궁터로, 야간 조명과 연못 풍경이 아름다운 대표 야경 명소입니다.",
    checklist: [
      { label: "휠체어 접근", status: "가능", tone: "good" },
      { label: "영유아 동반", status: "가능", tone: "good" },
      { label: "주차", status: "가능", tone: "good" },
      { label: "장애인화장실", status: "있음", tone: "good" },
      { label: "반려동물 동반", status: "어려움", tone: "warn" },
      { label: "도보 부담", status: "보통", tone: "plain" },
    ],
  },
  {
    id: 3,
    name: "월정교",
    status: "여유",
    orderLabel: "세번째 코스",
    address: "경상북도 경주시 교동 274",
    description:
      "월정교는 복원된 신라 시대 교량으로, 강변 산책과 야경 감상에 좋은 장소입니다.",
    checklist: [
      { label: "휠체어 접근", status: "가능", tone: "good" },
      { label: "영유아 동반", status: "가능", tone: "good" },
      { label: "주차", status: "어려움", tone: "warn" },
      { label: "장애인화장실", status: "있음", tone: "good" },
      { label: "반려동물 동반", status: "가능", tone: "good" },
      { label: "도보 부담", status: "보통", tone: "plain" },
    ],
  },
  {
    id: 4,
    name: "월정교",
    status: "여유",
    orderLabel: "네번째 코스",
    address: "경상북도 경주시 교동 274",
    description:
      "하루를 마무리하며 야간 조명을 감상하기 좋은 코스의 마지막 장소입니다.",
    checklist: [
      { label: "휠체어 접근", status: "가능", tone: "good" },
      { label: "영유아 동반", status: "가능", tone: "good" },
      { label: "주차", status: "어려움", tone: "warn" },
      { label: "장애인화장실", status: "있음", tone: "good" },
      { label: "반려동물 동반", status: "가능", tone: "good" },
      { label: "도보 부담", status: "보통", tone: "plain" },
    ],
  },
];

const REST_PLACES: RestPlace[] = [
  {
    id: 1,
    name: "카페 황리단",
    category: "카페",
    distance: "약 12분 · 1.2km",
    address: "경주 황리단길 140-25 (황남동)",
    description:
      "황리단길 중심에 있는 조용한 카페예요. 다음 장소로 이동하기 전에 잠깐 쉬어가기 좋아요.",
  },
  {
    id: 2,
    name: "교리김밥 본점",
    category: "음식점",
    distance: "약 12분 · 1.2km",
    address: "경주 교촌길 39-2",
    description:
      "가볍게 식사하기 좋은 경주 대표 분식점이에요. 이동 동선에서 크게 벗어나지 않아요.",
  },
];

function checklistClass(tone: ChecklistTone) {
  if (tone === "good") return "bg-status-success text-white";
  if (tone === "warn") return "bg-status-warning text-white";
  return "bg-[#e8d45b] text-white";
}

function CourseSteps({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="-mx-3 mt-3 flex gap-4 overflow-x-auto px-3 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PLACES.map((place, index) => (
        <button
          key={`${place.id}-${index}`}
          type="button"
          onClick={() => onSelect(index)}
          className="flex w-[58px] shrink-0 flex-col items-center gap-1"
        >
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-full text-label font-bold ${
              activeIndex === index
                ? "bg-primary-400 text-white"
                : "bg-primary-50 text-primary-400"
            }`}
          >
            {index + 1}
          </span>
          <span className="w-full truncate text-center text-caption font-bold text-text-heading">
            {place.name}
          </span>
          <span className="rounded-full bg-bg-main px-3 py-0.5 text-caption text-text-heading">
            {place.status}
          </span>
        </button>
      ))}
    </div>
  );
}

function BookmarkButton({
  active,
  onClick,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={active ? "북마크 해제" : "북마크"}
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center ${className}`}
    >
      <Star
        size={22}
        className={active ? "text-status-warning" : "text-text-heading"}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}

function PlaceInfoSheet({
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
    <BottomSheet onClose={onClose}>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-title3 text-text-heading">{place.name}</h2>
          <p className="mt-1 text-caption text-text-heading">{place.address}</p>
        </div>
        <BookmarkButton active={bookmarked} onClick={onToggleBookmark} />
      </header>
      <Placeholder className="mt-4 h-[220px]">사진</Placeholder>
      <p className="mt-4 text-caption leading-[1.55] text-text-heading">{place.description}</p>
      <Checklist place={place} />
      <div className="mt-4 grid grid-cols-[1fr_1.4fr] gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-[52px] rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          닫기
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-[52px] rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          관광카드 저장
        </button>
      </div>
    </BottomSheet>
  );
}

function NextPlaceSheet({
  place,
  onRest,
  onClose,
  onMove,
}: {
  place: Place;
  onRest: () => void;
  onClose: () => void;
  onMove: () => void;
}) {
  return (
    <BottomSheet onClose={onClose}>
      <h2 className="text-title3 text-text-heading">다음 장소로 이동하시겠어요?</h2>
      <p className="mt-2 text-label text-text-heading">
        신라 야경 코스의 두번째 장소는
        <br />
        <span className="font-bold text-primary-500">{place.name}</span> 입니다
      </p>
      <p className="mt-3 text-caption text-text-heading">예상 이동 시간 15분 - 도보</p>
      <Placeholder className="mt-4 h-[130px]">사진</Placeholder>
      <Checklist place={place} />
      <section className="mt-4 rounded-[8px] bg-bg-card p-4 text-center">
        <button type="button" onClick={onRest} className="w-full">
          <h3 className="text-body2 font-bold text-text-heading">쉬었다 갈래요</h3>
          <p className="mt-1 text-caption text-text-heading">
            OISO가 주변 맛집 및 카페를 추천해줘요
          </p>
        </button>
      </section>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-[61px] rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          건너뛰기
        </button>
        <button
          type="button"
          onClick={onMove}
          className="h-[61px] rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          이동하기
        </button>
      </div>
    </BottomSheet>
  );
}

function RestListScreen({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (place: RestPlace) => void;
}) {
  return (
    <section className="absolute inset-0 z-50 bg-bg-main px-4 pt-16">
      <header className="absolute left-4 right-4 top-4 flex h-10 items-center justify-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="뒤로가기"
          className="absolute left-0 flex h-10 w-10 items-center justify-center"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-body2 font-bold text-text-heading">추천 장소</h1>
      </header>

      <div className="h-11 border border-border-2 bg-bg-main" />

      <section className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-title3 text-text-heading">주변 장소</h2>
          <button type="button" className="text-body2 font-bold text-text-heading">
            내 위치
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {REST_PLACES.map((place) => (
            <button
              key={place.id}
              type="button"
              onClick={() => onSelect(place)}
              className="flex w-full items-center gap-3 text-left"
            >
              <span className="h-12 w-12 shrink-0 rounded-[8px] bg-bg-card" />
              <span className="min-w-0 flex-1">
                <span className="block text-body2 font-bold text-text-heading">
                  {place.name}
                  <span className="ml-2 rounded-full bg-primary-300 px-2 py-1 text-caption text-white">
                    {place.category}
                  </span>
                </span>
                <span className="mt-1 block text-caption text-text-heading">{place.distance}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

function RestDetailScreen({
  place,
  bookmarked,
  onToggleBookmark,
  onBack,
  onConfirm,
}: {
  place: RestPlace;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <section className="absolute inset-0 z-50 bg-bg-main px-4 pt-16">
      <header className="absolute left-4 right-4 top-4 flex h-10 items-center">
        <button
          type="button"
          onClick={onBack}
          aria-label="뒤로가기"
          className="flex h-10 w-10 items-center justify-center"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      <section className="flex items-start justify-between">
        <div>
          <h1 className="text-title3 text-text-heading">{place.name}</h1>
          <p className="mt-1 text-caption text-text-heading">{place.address}</p>
        </div>
        <BookmarkButton active={bookmarked} onClick={onToggleBookmark} />
      </section>

      <Placeholder className="mt-4 h-[180px]">사진</Placeholder>
      <p className="mt-4 text-label leading-[1.5] text-text-heading">{place.description}</p>

      <section className="mt-[150px]">
        <h2 className="text-title3 text-text-heading">추천 장소 추가</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["교리김밥 본점", "대릉원", "대릉원"].map((label, index) => (
            <button key={`${label}-${index}`} type="button" className="text-left">
              <span className="block h-[96px] rounded-[4px] bg-bg-card" />
              <span className="mt-2 block text-body2 font-bold text-text-heading">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="absolute bottom-0 left-4 right-4 grid h-[61px] grid-cols-2 gap-3 bg-bg-main">
        <button
          type="button"
          className="rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          길찾기
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          방문하기
        </button>
      </footer>
    </section>
  );
}

function AddRestConfirmSheet({
  place,
  onCancel,
  onAdd,
}: {
  place: RestPlace;
  onCancel: () => void;
  onAdd: () => void;
}) {
  return (
    <>
      <div className="absolute inset-0 z-[60] bg-black/35" />
      <section className="absolute bottom-[210px] left-8 right-8 z-[70] rounded-[16px] bg-bg-main p-4 text-center">
        <h2 className="mt-4 text-title3 text-text-heading">
          {place.name}을
          <br />
          이번 여행에 추가할까요?
        </h2>
        <p className="mt-6 text-caption text-text-heading">
          추가한 장소는
          <br />
          여행 코스와 여행 노트에 추가됩니다.
        </p>
        <div className="mt-6 grid h-[52px] grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
          >
            추가
          </button>
        </div>
      </section>
    </>
  );
}

function Checklist({ place }: { place: Place }) {
  return (
    <section className="mt-4">
      <h3 className="text-label font-bold text-text-heading">관광지 체크리스트</h3>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-3 rounded-[8px] bg-bg-card p-4">
        {place.checklist.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <span className="text-caption text-text-heading">{item.label}</span>
            <span className={`rounded-full px-3 py-1 text-caption ${checklistClass(item.tone)}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
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
      <section className="absolute inset-x-0 bottom-0 z-50 max-h-[82dvh] overflow-y-auto rounded-t-[28px] bg-bg-main px-6 pb-6 pt-7">
        {children}
      </section>
    </>
  );
}

export default function DetailsPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [sheet, setSheet] = useState<"place" | "next" | null>(null);
  const [restFlow, setRestFlow] = useState<"list" | "detail" | null>(null);
  const [restConfirmOpen, setRestConfirmOpen] = useState(false);
  const [selectedRestPlace, setSelectedRestPlace] = useState<RestPlace | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const activePlace = PLACES[activeIndex];
  const nextPlace = PLACES[Math.min(activeIndex + 1, PLACES.length - 1)];

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const moveNext = () => {
    setActiveIndex((current) => Math.min(current + 1, PLACES.length - 1));
    setSheet(null);
  };

  return (
    <PhoneShell className="pb-[112px]">
      <header className="sticky top-0 z-20 bg-bg-main px-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-8 items-center text-label text-text-heading"
        >
          <ChevronLeft size={20} />
          뒤로가기
        </button>
      </header>

      <main className="px-4">
        <section className="rounded-[8px] bg-bg-card p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption text-text-heading">진행중인 여정</p>
              <h1 className="text-body2 font-bold text-text-heading">신라 야경 코스</h1>
            </div>
            <button
              type="button"
              className="h-8 rounded-full bg-bg-main px-3 text-caption text-text-heading"
            >
              여행 중단하기
            </button>
          </div>
          <CourseSteps activeIndex={activeIndex} onSelect={setActiveIndex} />
          <p className="mt-3 text-caption font-bold text-text-heading">
            예상 소요 시간 2시간 30분
          </p>
          <button
            type="button"
            className="mt-2 w-full rounded-[8px] bg-bg-main p-3 text-left"
          >
            <p className="text-caption font-bold text-text-heading">혼잡 회피 대체 코스 제안</p>
            <p className="mt-1 text-caption text-text-heading">
              조금 더 여유로운 코스로 추천해드릴까요?
            </p>
          </button>
        </section>

        <section className="mt-2 rounded-[8px] bg-bg-card p-4">
          <header className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption text-text-heading">{activePlace.orderLabel}</p>
              <h2 className="text-title2 text-text-heading">{activePlace.name}</h2>
            </div>
            <BookmarkButton
              active={bookmarks.has(activePlace.id)}
              onClick={() => toggleBookmark(activePlace.id)}
            />
          </header>
          <Placeholder className="mt-3 h-[152px] bg-bg-main text-caption">사진</Placeholder>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <button className="h-[52px] rounded-[8px] bg-bg-main text-caption text-text-heading">
              메모 남기기
            </button>
            <button className="h-[52px] rounded-[8px] bg-bg-main text-caption text-text-heading">
              스토리카드
            </button>
            <button
              type="button"
              onClick={() => setSheet("place")}
              className="h-[52px] rounded-[8px] bg-bg-main text-caption text-text-heading"
            >
              정보 보기
            </button>
          </div>
        </section>

        <section className="mt-2 rounded-[8px] bg-bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-label font-bold text-text-heading">미션 & 스탬프 투어</h2>
            <span className="text-label text-text-heading">1/4</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { id: "visit-1", label: "첨성대 방문하기" },
              { id: "visit-2", label: "첨성대 방문하기" },
              { id: "story", label: "첨성대 스토리카드 읽기" },
            ].map((mission) => (
              <button
                key={mission.id}
                type="button"
                className="flex h-[64px] flex-col items-center justify-center gap-2 rounded-[8px] bg-bg-main text-caption text-text-heading"
              >
                <span className="h-4 w-4 rounded-[4px] bg-gray-300" />
                {mission.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 flex h-[58px] w-full flex-col items-center justify-center gap-2 rounded-[8px] bg-bg-main text-caption text-text-heading"
          >
            <span className="h-4 w-4 rounded-[4px] bg-gray-300" />
            근처 카페 QR 인증
          </button>
        </section>
      </main>

      <footer className="absolute bottom-0 left-4 right-4 z-20 bg-bg-main">
        <button
          type="button"
          onClick={() => setSheet("next")}
          className="h-[61px] w-full rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          다음 장소로 이동하기
        </button>
      </footer>

      {sheet === "place" && (
        <PlaceInfoSheet
          place={activePlace}
          bookmarked={bookmarks.has(activePlace.id)}
          onToggleBookmark={() => toggleBookmark(activePlace.id)}
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "next" && (
        <NextPlaceSheet
          place={nextPlace}
          onRest={() => {
            setSheet(null);
            setRestFlow("list");
          }}
          onClose={() => setSheet(null)}
          onMove={moveNext}
        />
      )}
      {restFlow === "list" && (
        <RestListScreen
          onClose={() => setRestFlow(null)}
          onSelect={(place) => {
            setSelectedRestPlace(place);
            setRestFlow("detail");
          }}
        />
      )}
      {restFlow === "detail" && selectedRestPlace && (
        <RestDetailScreen
          place={selectedRestPlace}
          bookmarked={bookmarks.has(1000 + selectedRestPlace.id)}
          onToggleBookmark={() => toggleBookmark(1000 + selectedRestPlace.id)}
          onBack={() => setRestFlow("list")}
          onConfirm={() => setRestConfirmOpen(true)}
        />
      )}
      {restConfirmOpen && selectedRestPlace && (
        <AddRestConfirmSheet
          place={selectedRestPlace}
          onCancel={() => setRestConfirmOpen(false)}
          onAdd={() => {
            setRestConfirmOpen(false);
            setRestFlow(null);
          }}
        />
      )}
    </PhoneShell>
  );
}
