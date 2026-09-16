import HomeIcon from '@/assets/icons/home-icon.svg?react'
import CourseIcon from '@/assets/icons/map-maker-icon.svg?react'
import PlaceIcon from '@/assets/icons/search-icon.svg?react'
import MyIcon from '@/assets/icons/user-icon.svg?react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/stores/auth-store'
import { useRequireAuth } from '@/hooks/use-require-auth'

const NAV_CONFIG = [
  {
    label: 'home',
    path: '/',
    Icon: HomeIcon,
  },
  {
    label: 'course',
    path: '/course',
    Icon: CourseIcon,
  },
  {
    label: 'place',
    path: '/place',
    Icon: PlaceIcon,
  },
  {
    label: 'mypage',
    path: '/my',
    Icon: MyIcon,
    guestBlocked: true,
  },
] as const

function BottomNavBar() {
  const { t } = useTranslation('common')
  const { role } = useAuth()
  const requireAuth = useRequireAuth()

  return (
    <nav className="rounded-full flex items-center absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] h-17.5 bg-white p-1 border border-border-1">
      {NAV_CONFIG.map((navItem) => (
        <Link
          key={navItem.label}
          inactiveProps={{
            className: '[&_svg]:fill-text-subdued [&_span]:text-text-subdued',
          }}
          activeProps={{
            className:
              'bg-primary-50 [&_svg]:fill-brand-primary [&_span]:text-brand-primary',
          }}
          to={navItem.path}
          onClick={(e) => {
            // 게스트가 로그인 전용 탭(마이페이지) 클릭 시 이동 막고 로그인 유도
            if ('guestBlocked' in navItem && role !== 'user') {
              e.preventDefault()
              requireAuth(() => {})
            }
          }}
          className="h-full flex-1 flex flex-col items-center rounded-full justify-center gap-0.5"
        >
          <navItem.Icon />
          <span className="text-caption font-semibold">
            {t(`nav.${navItem.label}`)}
          </span>
        </Link>
      ))}
    </nav>
  )
}

export default BottomNavBar
