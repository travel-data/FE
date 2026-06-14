"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Suspense, useState } from "react";
import { PhoneShell } from "../../components/mobile";

const NO_PLAN_STEPS = ["long", "with-who", "theme", "prefer-vehicle"] as const;
type NoplanStep = (typeof NO_PLAN_STEPS)[number];

const STEP_META: Record<NoplanStep, { index: number }> = {
  long: { index: 0 },
  "with-who": { index: 1 },
  theme: { index: 2 },
  "prefer-vehicle": { index: 3 },
};

function getNextStep(current: NoplanStep): NoplanStep | null {
  const idx = NO_PLAN_STEPS.indexOf(current);
  return idx < NO_PLAN_STEPS.length - 1 ? NO_PLAN_STEPS[idx + 1] : null;
}

// ─── 공용 컴포넌트 ─────────────────────────────────────────

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-[8px] border-2 px-5 py-5 text-left text-body2 font-bold transition-colors ${
        selected
          ? "bg-primary-50 border-brand-primary text-brand-secondary"
          : "bg-bg-card border-transparent text-text-heading"
      }`}
    >
      {label}
    </button>
  );
}

function GridOptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[8px] border-2 py-5 text-center text-body2 font-bold transition-colors ${
        selected
          ? "bg-primary-50 border-brand-primary text-brand-secondary"
          : "bg-bg-card border-transparent text-text-heading"
      }`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="border-t border-border-1 my-1" />;
}

// ─── Step: long ───────────────────────────────────────────

const LONG_OPTIONS = [
  { value: "under-3h", label: "3시간 미만" },
  { value: "one-day", label: "하루" },
  { value: "overnight", label: "1박 이상" },
];

function StepLong({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-title1 text-text-heading mb-2">얼마나 오래 여행하시나요?</h2>
      {LONG_OPTIONS.map((opt) => (
        <OptionButton
          key={opt.value}
          label={opt.label}
          selected={selected === opt.value}
          onClick={() => onSelect(opt.value)}
        />
      ))}
    </div>
  );
}

// ─── Step: with-who ───────────────────────────────────────

const COMPANION_OPTIONS = [
  { value: "alone", label: "혼자" },
  { value: "couple", label: "연인" },
  { value: "family", label: "가족" },
  { value: "group", label: "단체" },
];

function StepWithWho({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) {
  const [withPet, setWithPet] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-title1 text-text-heading mb-2">누구랑 여행하시나요?</h2>
      <div className="grid grid-cols-2 gap-3">
        {COMPANION_OPTIONS.map((opt) => (
          <GridOptionButton
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
      <Divider />
      <button
        onClick={() => setWithPet((p) => !p)}
        className={`w-full text-left px-5 py-5 rounded-2xl text-body2 font-bold border-2 transition-colors ${
          withPet
            ? "bg-primary-50 border-brand-primary text-brand-secondary"
            : "bg-bg-card border-transparent text-text-heading"
        }`}
      >
        반려동물도 함께해요
      </button>
    </div>
  );
}

// ─── Step: theme ──────────────────────────────────────────

const THEME_OPTIONS = [
  { value: "history", label: "역사" },
  { value: "nature", label: "자연" },
  { value: "food", label: "맛집" },
  { value: "culture", label: "문화" },
  { value: "healing", label: "힐링" },
];

function StepTheme({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-title1 text-text-heading mb-2">선호하는 여행 테마가 있나요?</h2>
      {THEME_OPTIONS.map((opt) => (
        <OptionButton
          key={opt.value}
          label={opt.label}
          selected={selected === opt.value}
          onClick={() => onSelect(opt.value)}
        />
      ))}
      <Divider />
      <OptionButton
        label="상관없음"
        selected={selected === "no-preference"}
        onClick={() => onSelect("no-preference")}
      />
    </div>
  );
}

// ─── Step: prefer-vehicle ─────────────────────────────────

const VEHICLE_OPTIONS = [
  { value: "walk", label: "도보" },
  { value: "car", label: "자동차" },
  { value: "bicycle", label: "자전거" },
  { value: "transit", label: "대중교통" },
];

function StepPreferVehicle({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-title1 text-text-heading mb-2">주로 어떻게 이동하시나요?</h2>
      <div className="grid grid-cols-2 gap-3">
        {VEHICLE_OPTIONS.map((opt) => (
          <GridOptionButton
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── 메인 ─────────────────────────────────────────────────

function TravelInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") as NoplanStep | null;
  const [selectedByStep, setSelectedByStep] = useState<Partial<Record<NoplanStep, string>>>({});

  const goToStep = (s: NoplanStep) => router.push(`/course/traveler-info?step=${s}`);

  const goNext = (current: NoplanStep) => {
    const next = getNextStep(current);
    if (next) goToStep(next);
    else router.push("/course?mode=recommended");
  };

  const totalSteps = NO_PLAN_STEPS.length;
  const currentIndex = step ? (STEP_META[step]?.index ?? 0) : null;
  const isStepScreen = step !== null && STEP_META[step] !== undefined;
  const selected = isStepScreen ? (selectedByStep[step] ?? null) : null;
  const setSelected = (value: string) => {
    if (!isStepScreen) return;
    setSelectedByStep((prev) => ({ ...prev, [step]: value }));
  };

  return (
    <PhoneShell className="pb-[92px]">
      {/* 헤더 */}
      <header className="sticky top-0 z-20 flex h-16 items-center bg-bg-main px-4">
        <button onClick={() => router.back()} className="-ml-2 flex h-10 w-10 items-center justify-center text-text-heading">
          <ChevronLeft size={24} />
        </button>
      </header>

      {/* 스크롤 콘텐츠 */}
      <main className="px-5 pt-2">

        {/* 계획 여부 선택 */}
        {!isStepScreen && (
          <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-title1 text-text-heading">여행 계획이 있으신가요?</h1>
            <button
              onClick={() => router.push("/course?mode=manual")}
              className="w-full rounded-[8px] bg-bg-card px-5 py-5 text-left text-body2 font-bold text-text-heading"
            >
              계획이 있어요
            </button>
            <button
              onClick={() => goToStep("long")}
              className="w-full rounded-[8px] bg-bg-card px-5 py-5 text-left text-body2 font-bold text-text-heading"
            >
              아직 계획이 없어요
            </button>
          </div>
        )}

        {/* 단계별 화면 */}
        {isStepScreen && (
          <>
            {/* 진행 바 */}
            <div className="flex gap-1.5 mb-4">
              {NO_PLAN_STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= (currentIndex ?? 0) ? "bg-brand-primary" : "bg-bg-card"
                  }`}
                />
              ))}
            </div>
            <p className="text-label text-text-subdued mb-5">
              {(currentIndex ?? 0) + 1} / {totalSteps}
            </p>

            {step === "long" && <StepLong selected={selected} onSelect={setSelected} />}
            {step === "with-who" && <StepWithWho selected={selected} onSelect={setSelected} />}
            {step === "theme" && <StepTheme selected={selected} onSelect={setSelected} />}
            {step === "prefer-vehicle" && <StepPreferVehicle selected={selected} onSelect={setSelected} />}
          </>
        )}
      </main>

      {/* 하단 다음 버튼 */}
      {isStepScreen && (
        <div className="absolute bottom-0 left-5 right-5 z-20 bg-bg-main py-4">
          <button
            disabled={selected === null}
            onClick={() => step && goNext(step)}
            className={`h-[61px] w-full rounded-[8px] text-body2 font-bold transition-colors ${
              selected !== null
                ? "bg-brand-primary text-white"
                : "bg-disabled text-text-subdued cursor-not-allowed"
            }`}
          >
            다음
          </button>
        </div>
      )}
    </PhoneShell>
  );
}

export default function TravelInfoPage() {
  return (
    <Suspense>
      <TravelInfoContent />
    </Suspense>
  );
}
