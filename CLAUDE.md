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
- 마크업 중 번역되어 있는 단어가 없다면 json 파일을 직접 수정하지 않고 파일럿에게 번역파일 시트 업데이트를 요청하여야 하고, 시트 수정을 요청 할 때는 ko, en 단어를 각각 번역하여 제공 할 것

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

## API 연동 (Backend)

- Swagger UI: https://oiso.duckdns.org/swagger-ui/index.html
- 로컬 스펙 캐시: `docs/api-spec.json`
- API 관련 작업 시 위 로컬 파일을 우선 참고할 것. 네트워크 요청으로 원격 fetch는 하지 말 것.
- 스펙이 최신인지 확실하지 않거나 새 엔드포인트가 필요하면, 원격 재요청 대신 사용자에게 스펙 갱신을 요청할 것

### 공통 응답 구조

대부분의 응답은 아래 래퍼를 따름:

```ts
interface CommonResponse<T> {
  code: number
  message: string
  data: T
}
```

### 인증

- JWT는 쿠키 기반 (`/api/auth/dev-login`, `/api/auth/refresh`, `/api/auth/logout`, `GET /api/auth/me`)
- 별도 Authorization 헤더 처리 불필요, axios 인스턴스에 `withCredentials: true` 설정

### 타입 정의 규칙

- Enum, 필드명, nullable 여부 등은 `docs/api-spec.json`의 `components.schemas`를 그대로 반영해서 타입 정의할 것 (하드코딩된 값 목록을 CLAUDE.md에 별도로 두지 않음 — 스펙 변경 시 어긋날 수 있으므로 항상 json 원본이 source of truth)
- `enum` 필드는 spec에 정의된 문자열 그대로 TypeScript union 또는 enum으로 변환
- 좌표(latitude/longitude)처럼 "함께 보내거나 둘 다 null"인 필드는 타입에서도 함께 optional 처리

### 코드 생성 규칙

API 요청/타입 코드를 작성할 때:

- 타입은 `src/types/{domain}.ts` 에 위치 (예: `types/festival.ts`, `types/preferences.ts`)
- 요청 함수는 `src/api/{domain}.ts` 에 위치, axios 인스턴스는 `src/lib/axios.ts` 사용
- async/await 키워드를 사용하여 함수를 선언할 것
- TanStack Query 훅은 `src/hooks/queries/{domain}.ts` 에 위치, 쿼리 키는 `[domain, ...params]` 배열 형태
- `CommonResponse<T>` 래퍼는 훅 내부에서 unwrap해서 컴포넌트에는 `T`만 노출

※ 이 프로젝트는 공모전 MVP로, orval 등 codegen 도구는 도입하지 않고 필요 시점에 위 규칙에 맞춰 수동/AI 생성 코드로 관리함
