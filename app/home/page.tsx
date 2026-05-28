"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Download, Globe } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
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
    <div className="flex flex-col h-screen bg-bg-main">
      {/* 상단 헤더 */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 bg-bg-main">
        <div className="w-10 h-10 bg-brand-primary rounded-xl" />
        <div className="relative">
          <button
            type="button"
            aria-label="언어 선택"
            aria-expanded={isLanguageOpen}
            onClick={() => setIsLanguageOpen((isOpen) => !isOpen)}
            className="p-2 text-text-subdued"
          >
            <Globe size={22} />
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 top-11 z-20 w-36 rounded-2xl border border-border-1 bg-bg-main p-1 shadow-lg">
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
                    className={`w-full rounded-xl px-3 py-2 text-left text-label font-bold ${
                      isSelected
                        ? "bg-bg-card text-text-heading"
                        : "text-text-subdued"
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
          </div>
          <button
            onClick={() => router.push("/course/traveler-info")}
            className="mt-4 w-full bg-bg-main border border-border-1 text-text-heading text-label font-bold py-3 rounded-full"
          >
            코스 추천 받으러가기
          </button>
        </div>

        {/* 관광카드 */}
        <section className="bg-bg-card rounded-2xl overflow-hidden">
          <button
            type="button"
            aria-expanded={isTourCardOpen}
            onClick={() => setIsTourCardOpen((isOpen) => !isOpen)}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <span className="text-body2 text-text-heading font-bold">관광카드</span>
            <ChevronDown
              size={18}
              className={`text-text-subdued transition-transform ${
                isTourCardOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isTourCardOpen && (
            <div className="px-4 pb-4">
              <div className="flex items-stretch gap-3">
                <Image
                  src={tourCardUrl}
                  alt="경주 관광카드"
                  width={112}
                  height={160}
                  className="w-28 h-40 shrink-0 rounded-xl object-cover border border-border-1"
                />
                <div className="min-w-0 flex-1 flex flex-col justify-between py-1">
                  <div>
                    <p className="text-body2 text-text-heading font-bold">
                      경주 관광카드
                    </p>
                    <p className="text-caption text-text-subdued mt-1">
                      카드 이미지를 저장해 오프라인에서도 확인하세요
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadTourCard}
                    className="mt-3 w-full bg-brand-primary text-white text-label font-bold py-3 rounded-full flex items-center justify-center gap-2 active:bg-pressed"
                  >
                    <Download size={16} />
                    카드 다운받기
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* OISO 추천 관광 코스 */}
        <section className="space-y-2">
          <h4 className="text-title3 text-text-heading px-1">OISO가 추천하는 관광 코스</h4>
          <div className="bg-bg-card rounded-2xl aspect-video relative" />
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
