# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # 개발 서버 실행 (Vite)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run format       # Prettier 포맷 적용
npm run format:check # Prettier 포맷 검사
npm run i18n:sync    # Google Sheets에서 번역 파일 동기화
```

테스트 설정 없음.

## Architecture

**OISO** — 모바일 웹 여행 앱. 화면 최대 너비 430px로 제한되는 `PhoneShell` 래퍼로 감싸져 모바일 앱처럼 보인다(`src/components/mobile.tsx`).

### 라우팅 (TanStack Router)

파일 기반 라우팅. `src/routes/` 폴더 구조가 URL 구조가 된다. `routeTree.gen.ts`는 자동 생성되므로 직접 수정하지 않는다.

- `src/routes/__root.tsx` — 루트 레이아웃 (PhoneShell 적용)
- `src/routes/(authentication)/route.tsx` — 인증 필요 페이지 레이아웃. `role === null`이면 `/login`으로 리다이렉트
- `src/routes/(authentication)/note/` — 여행노트 관련 페이지들 (`$courseId`, `$courseId_.place.$placeId`, 메모 편집)

### 인증 흐름

카카오 OAuth2 소셜 로그인만 지원. 백엔드(`VITE_API_BASE_URL`)로 리다이렉트하여 처리.

1. `startKakaoLogin()` → 백엔드 OAuth 엔드포인트로 이동 (`src/api/auth.ts`)
2. 로그인 성공 후 `/login-success` 콜백 라우트에서 상태 설정
3. `useAuthCheck` hook이 `/api/auth/me` 호출로 인증 상태 검증
4. `useAuthStore` (Zustand + persist) — `role: 'user' | 'guest' | null`을 localStorage에 저장
5. `apiClient`의 응답 인터셉터가 401 발생 시 `/api/auth/refresh`로 토큰 갱신, 실패 시 `/login`으로 이동 (`src/lib/api-client.ts`)

### 상태 관리

- **Zustand** — 전역 클라이언트 상태 (`src/stores/`)
  - `useAuthStore` — 인증 상태, localStorage persist 적용
- **TanStack Query** — 서버 상태 및 캐싱 (`src/lib/query-client.ts`)
  - query key는 `src/constants/query-key.ts`에서 중앙 관리

### API 클라이언트

- `src/lib/api-client.ts` (`apiClient`) — 백엔드 API 호출. `withCredentials: true`, 401 자동 갱신 로직 포함
- `src/services/instance.ts` (`kakao`) — 카카오 Local API 호출. `VITE_KAKAO_REST_API_KEY` 필요

### 다국어 지원 (i18next)

지원 언어: `ko`, `en`. 기본값 `ko`.

- 번역 파일: `src/locales/{ko,en}/{namespace}.json` (namespace: `common`, `auth`, `course`, `home`, `my`, `place`)
- 언어 설정은 localStorage의 `language` 키에 저장
- `npm run i18n:sync`로 Google Sheets 원본에서 번역 파일 갱신

### 스타일링

Tailwind CSS v4 + shadcn/ui (new-york 스타일).

- 디자인 토큰(색상, 타이포그래피)은 CSS 변수로 정의: `src/styles/color.css`, `src/styles/typography.css`
- 타이포그래피 클래스: `text-heading1`, `text-title1`~`text-title3`, `text-body1`~`body2`, `text-label`, `text-caption`
- 색상 클래스: `text-text-heading`, `text-text-default`, `text-text-subdued`, `bg-brand-primary` 등
- shadcn/ui 컴포넌트는 `src/components/ui/`에 위치
- Path alias: `@/` → `src/`

### 환경 변수 (`.env`)

```
VITE_API_BASE_URL        # 백엔드 API 기본 URL (기본값: http://localhost:8080)
VITE_KAKAO_REST_API_KEY  # 카카오 REST API 키
```
