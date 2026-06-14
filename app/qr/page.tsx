"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";
import { ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PhoneShell } from "../components/mobile";

const qrOptions = {
  preferredCamera: "environment" as const,
  maxScansPerSecond: 1,
  highlightCodeOutline: true,
};

export default function QrPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isScannedRef = useRef(false);
  const [message, setMessage] = useState("관광지 또는 주변 장소의 QR을 비춰주세요");

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const qrScanner = new QrScanner(
      videoElement,
      async (result) => {
        if (isScannedRef.current) return;

        isScannedRef.current = true;
        qrScanner.stop();
        window.alert(result.data);
        router.replace("/home?trip=active");
      },
      qrOptions,
    );

    const startScanner = async () => {
      try {
        await qrScanner.start();
        setMessage("QR을 스캔하는 중이에요");
      } catch (error) {
        setMessage("카메라 권한을 허용해주세요");
        if (error === "Camera not found.") {
          window.alert("카메라 권한을 허용시켜주세요");
        }
      }
    };

    startScanner();

    return () => {
      qrScanner.destroy();
    };
  }, [router]);

  return (
    <PhoneShell>
      <header className="flex h-16 items-center justify-between px-4">
        <Link
          href="/home?trip=active"
          aria-label="뒤로가기"
          className="-ml-2 flex h-10 w-10 items-center justify-center text-text-heading"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-body2 font-bold text-text-heading">QR 인증</h1>
        <span className="h-10 w-10" />
      </header>

      <main className="flex min-h-[calc(100dvh-64px)] flex-col px-4 pb-6">
        <section className="flex flex-1 flex-col justify-center gap-4">
          <div className="relative h-[360px] overflow-hidden rounded-[8px] border border-border-1 bg-bg-card">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted
            />
          </div>
          <p className="text-center text-label text-text-subdued">{message}</p>
        </section>

        <Link
          href="/home?trip=active"
          className="flex h-[61px] w-full items-center justify-center rounded-[8px] bg-bg-card text-body2 font-bold text-text-heading"
        >
          돌아가기
        </Link>
      </main>
    </PhoneShell>
  );
}
