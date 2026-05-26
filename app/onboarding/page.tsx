"use client";

import { useRouter } from "next/navigation";

type Language = "KOR" | "ENG";

export default function OnboardingPage() {
  const router = useRouter();

  const handleSelect = (lang: Language) => {
    router.push("/login");
  };

  return (
    <main className="relative h-screen bg-white px-6 overflow-hidden">
      {/* 상단 브랜드 + 안내 텍스트 */}
      <div className="pt-20">
        <h1 className="text-display1 text-text-heading">OISO</h1>
        <div className="mt-8">
          <p className="text-heading1 text-text-heading">언어를 선택해주세요</p>
          <p className="text-title3 text-text-subdued mt-1">Select your language</p>
        </div>
      </div>

      {/* 언어 선택 버튼 — 항상 화면 2/3 지점에 */}
      <div className="absolute top-2/3 left-6 right-6">
        <div className="grid grid-cols-2 gap-3">
          {[
            { code: "KOR" as Language, name: "한국어" },
            { code: "ENG" as Language, name: "English" },
          ].map(({ code, name }) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className="flex flex-col items-center justify-center rounded-2xl bg-primary-50 border border-primary-100 px-5 py-7 gap-2 active:bg-primary-100 transition-colors duration-150"
            >
              <span className="text-body2 text-brand-secondary tracking-widest">{code}</span>
              <span className="text-title1 text-text-heading">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
