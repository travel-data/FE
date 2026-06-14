"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Download, Globe } from "lucide-react";
import { Suspense, useState } from "react";
import { BottomNav, OisoLogo, PhoneShell, Placeholder } from "../components/mobile";

const courseCards = [
  { title: "신라 야경 코스", body: "첨성대, 동궁과 월지, 월정교를 잇는 밤 산책 코스" },
  { title: "천년 역사 산책", body: "대릉원과 황리단길을 여유롭게 둘러보는 반나절 코스" },
  { title: "아이와 걷는 경주", body: "이동 부담을 줄인 가족 맞춤 코스" },
];

const festivals = [
  { title: "경주 문화유산 야행", body: "밤에 만나는 신라의 문화유산" },
  { title: "황리단길 버스킹", body: "주말 저녁 골목 공연과 로컬 마켓" },
  { title: "보문 호수 산책제", body: "호수 주변에서 즐기는 계절 축제" },
];

type TripState = "before" | "active";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialState = searchParams.get("trip") === "before" ? "before" : "active";
  const [tripState, setTripState] = useState<TripState>(initialState);
  const [isTourCardOpen, setIsTourCardOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("KOR");
  const tourCardUrl = "/tour-card.jpg";
  const languages = [
    { code: "KOR", name: "한국어" },
    { code: "ENG", name: "English" },
  ];

  const downloadTourCard = async () => {
    try {
      const response = await fetch(tourCardUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = "oiso-tour-card.jpg";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      window.open(tourCardUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <PhoneShell className="pb-[130px]">
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between bg-bg-main px-4">
        <OisoLogo compact />
        <div className="relative">
          <button
            type="button"
            aria-label="언어 선택"
            aria-expanded={isLanguageOpen}
            onClick={() => setIsLanguageOpen((isOpen) => !isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] text-text-heading active:bg-bg-card"
          >
            <Globe size={24} />
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 top-12 z-40 w-36 rounded-[8px] border border-border-1 bg-bg-main p-1 shadow-lg">
              {languages.map((language) => {
                const isSelected = selectedLanguage === language.code;

                return (
                  <button
                    key={language.code}
                    type="button"
                    onClick={() => {
                      setSelectedLanguage(language.code);
                      setIsLanguageOpen(false);
                    }}
                    className={`h-10 w-full rounded-[6px] px-3 text-left text-label ${
                      isSelected
                        ? "bg-primary-50 font-bold text-primary-700"
                        : "text-text-heading"
                    }`}
                  >
                    {language.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      <main className="px-4">
        <div className="mb-3 grid grid-cols-2 rounded-[8px] bg-bg-card p-1">
          {[
            ["before", "여행 전"],
            ["active", "여행 중"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTripState(value as TripState)}
              className={`h-10 rounded-[6px] text-label font-bold ${
                tripState === value
                  ? "bg-bg-main text-text-heading shadow-sm"
                  : "text-text-subdued"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="rounded-[8px] bg-bg-card p-5">
          {tripState === "before" ? (
            <>
              <h1 className="text-title3 text-text-heading">현재 진행중인 여정이 없어요</h1>
              <p className="mt-1 text-label text-text-subdued">
                OISO와 함께 여정을 시작해보세요
              </p>
              <button
                type="button"
                onClick={() => router.push("/course/traveler-info")}
                className="mt-5 h-14 w-full rounded-[8px] bg-bg-main text-body2 font-bold text-text-heading active:bg-gray-200"
              >
                코스 추천 받으러가기
              </button>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-caption text-text-subdued">현재 진행 중인 여정</p>
                <h1 className="text-title3 text-text-heading">
                  신라 야경 코스 - 첫번째 여정 진행중
                </h1>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <strong className="text-title3 text-text-heading">첨성대</strong>
                <span className="rounded-full bg-primary-50 px-3 py-1 text-caption text-primary-600">
                  코스 공유중
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push("/details?from=home-active")}
                className="mt-4 h-14 w-full rounded-[8px] bg-bg-main text-body2 font-bold text-text-heading active:bg-gray-200"
              >
                진행중인 여정 보러가기
              </button>
            </>
          )}
        </section>

        <section className="mt-3 rounded-[8px] bg-bg-card">
          <button
            type="button"
            aria-expanded={isTourCardOpen}
            onClick={() => setIsTourCardOpen((isOpen) => !isOpen)}
            className="flex h-[52px] w-full items-center justify-between px-4"
          >
            <span className="text-title3 text-text-heading">관광카드</span>
            <ChevronDown
              size={18}
              className={`text-text-subdued transition-transform ${
                isTourCardOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isTourCardOpen && (
            <div className="grid gap-3 px-4 pb-4 sm:grid-cols-[112px_1fr]">
              <Image
                src={tourCardUrl}
                alt="경주 관광카드"
                width={112}
                height={160}
                className="h-40 w-28 rounded-[8px] border border-border-1 object-cover"
              />
              <div className="min-w-0">
                <p className="text-body2 font-bold text-text-heading">경주 관광카드</p>
                <p className="mt-1 text-caption text-text-subdued">
                  카드 이미지를 저장해 오프라인에서도 확인하세요
                </p>
                <button
                  type="button"
                  onClick={downloadTourCard}
                  className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-brand-primary text-label font-bold text-white active:bg-pressed"
                >
                  <Download size={16} />
                  카드 다운받기
                </button>
              </div>
            </div>
          )}
        </section>

        <Link
          href="/qr"
          className="mt-3 flex h-[52px] w-full items-center justify-center rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading active:bg-gray-200"
        >
          QR 인증
        </Link>

        <section className="mt-4">
          <h2 className="text-title3 text-text-heading">OISO가 추천하는 관광 코스</h2>
          <div className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {courseCards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => router.push("/details?from=recommendation")}
                className="flex h-[271px] w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-[8px] bg-bg-card text-left"
              >
                <Placeholder className="h-[150px] rounded-none text-label">사진</Placeholder>
                <div className="p-4">
                  <h3 className="text-body2 font-bold text-text-heading">{card.title}</h3>
                  <p className="mt-1 text-caption text-text-subdued">{card.body}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4">
          <h2 className="text-title3 text-text-heading">현재 경주에서 열리고 있는 축제</h2>
          <div className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {festivals.map((festival) => (
              <button
                key={festival.title}
                type="button"
                onClick={() => router.push("/details?from=festival")}
                className="flex h-[271px] w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-[8px] bg-bg-card text-left"
              >
                <Placeholder className="h-[150px] rounded-none text-label">사진</Placeholder>
                <div className="p-4">
                  <h3 className="text-body2 font-bold text-text-heading">{festival.title}</h3>
                  <p className="mt-1 text-caption text-text-subdued">{festival.body}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </PhoneShell>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
