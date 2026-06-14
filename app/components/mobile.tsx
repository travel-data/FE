import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Home, MapPinned, UserRound } from "lucide-react";

export function PhoneShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className="flex min-h-screen justify-center bg-gray-100">
      <section
        className={`relative min-h-dvh w-full max-w-[393px] overflow-x-hidden bg-bg-main text-text-default shadow-sm ${className}`}
      >
        {children}
      </section>
    </main>
  );
}

export function OisoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${compact ? "h-11" : "h-[60px]"}`}>
      <div className="h-11 w-11 rounded-xl bg-brand-primary" />
      {!compact && <span className="text-title3 font-bold text-text-heading">OISO</span>}
    </div>
  );
}

export function Placeholder({
  children = "사진",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[8px] bg-bg-card text-title3 text-text-subdued ${className}`}
    >
      {children}
    </div>
  );
}

export function BottomNav() {
  const items = [
    { label: "홈", icon: Home, href: "/home?trip=active", active: true },
    { label: "코스", icon: MapPinned, href: "/course?mode=recommended" },
    { label: "관광카드", icon: BookOpen, href: "/home?trip=active" },
    { label: "마이페이지", icon: UserRound, href: "/mypage" },
  ];

  return (
    <nav className="absolute inset-x-4 bottom-0 z-20 h-[72px] rounded-[8px] bg-bg-card px-3">
      <div className="grid h-full grid-cols-4 items-center">
        {items.map(({ label, icon: Icon, href, active }) => (
          <Link
            key={label}
            href={href}
            className={`flex flex-col items-center gap-1 text-caption ${
              active ? "text-primary-500" : "text-text-subdued"
            }`}
          >
            <Icon size={19} strokeWidth={2} />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
