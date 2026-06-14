"use client";

import { useRouter } from "next/navigation";
import { PhoneShell, OisoLogo } from "../components/mobile";

export default function LoginPage() {
  const router = useRouter();

  return (
    <PhoneShell>
      <section className="absolute left-4 right-4 top-0 h-[218px]">
        <div className="absolute left-0 top-8 flex h-[60px] w-[120px] items-center justify-center">
          <OisoLogo compact />
        </div>
        <div className="absolute left-0 top-[108px] space-y-[10px]">
          <p className="h-[50px] w-[361px] text-title3 font-bold leading-[50px] text-text-heading">
            경주를 더 편하게 여행하세요
          </p>
          <p className="h-[50px] w-[240px] text-body2 text-text-subdued">
            맞춤 코스와 관광카드를 한 곳에서
          </p>
        </div>
      </section>

      <section className="absolute left-4 right-4 top-[577px] h-[241px] space-y-[10px]">
        <button
          type="button"
          onClick={() => router.push("/home?trip=before")}
          className="h-[62px] w-full rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading active:bg-gray-200"
        >
          구글 로그인
        </button>
        <button
          type="button"
          onClick={() => router.push("/home?trip=before")}
          className="h-[62px] w-full rounded-[8px] bg-[#FEE500] text-body2 font-bold text-[#191919] active:opacity-80"
        >
          카카오 로그인
        </button>
        <div className="flex h-[25px] items-center justify-center">
          <span className="h-px w-[200px] bg-border-1" />
        </div>
        <button
          type="button"
          onClick={() => router.push("/home?trip=before")}
          className="h-[62px] w-full rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading active:bg-gray-200"
        >
          둘러보기
        </button>
      </section>
    </PhoneShell>
  );
}
