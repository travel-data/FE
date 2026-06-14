import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OISO",
  description: "OISO travel course service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col max-w-115 w-full mx-auto">{children}</body>
    </html>
  );
}
