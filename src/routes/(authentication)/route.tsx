import { useAuthCheck } from '@/hooks/use-auth-check'
import { checkAuth } from '@/api/auth'
import { queryClient } from '@/lib/query-client'
import { useAuthStore } from '@/stores/auth-store'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import LogoSymbol from '@/assets/icons/symbol.svg?react'

export const Route = createFileRoute('/(authentication)')({
  // 렌더 사이클 밖(라우팅 매칭)에서 접근 제어 → useLocation/Navigate 없이 무한 루프 위험 없음.
  // me를 캐시 기반으로 확정한 뒤 판정하므로 새로고침 시 로그인 유저를 오판하지 않는다.
  beforeLoad: async ({ location }) => {
    const authenticated = await queryClient.ensureQueryData({
      queryKey: ['auth', 'check'],
      queryFn: checkAuth,
    })

    // 로그인 사용자는 전체 접근 허용
    if (authenticated) return

    const role = useAuthStore.getState().role

    // 게스트는 허용된 경로만, 그 외는 홈으로
    if (role === 'guest') {
      if (GUEST_ALLOWED_PATHS.includes(location.pathname)) return
      throw redirect({ to: '/' })
    }

    // 비로그인 → 로그인
    throw redirect({ to: '/login' })
  },
  pendingComponent: () => (
    <div className="flex min-h-svh items-center justify-center">
      <LogoSymbol
        aria-label="OISO 로고"
        className="animate-pulse translate-y-[clamp(-16px,calc(8svh-59.2px),16px)] transition-transform duration-300"
        height={100}
        role="img"
        width={100}
      />
    </div>
  ),
  component: RouteComponent,
})

// 게스트가 조회 가능한 인증 경로 (그 외 공개 경로: 축제·추천상세·공유는 인증 폴더 밖)
const GUEST_ALLOWED_PATHS = ['/', '/place', '/course']

function RouteComponent() {
  // role 스토어 동기화용 (beforeLoad와 동일 쿼리 캐시를 공유해 추가 요청은 없음)
  useAuthCheck()
  return <Outlet />
}
