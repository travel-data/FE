import HomeIcon from '@/assets/icons/home-icon.svg?react'
import CourseIcon from '@/assets/icons/map-maker-icon.svg?react'
import NoteIcon from '@/assets/icons/book-icon.svg?react'
import MyIcon from '@/assets/icons/user-icon.svg?react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

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
    label: 'travel_note',
    path: '/note',
    Icon: NoteIcon,
  },
  {
    label: 'mypage',
    path: '/my',
    Icon: MyIcon,
  },
] as const

function BottomNavBar() {
  const { t } = useTranslation('common')

  return (
    <nav className="rounded-full flex items-center absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] h-17.5 bg-white p-1 border border-border-1">
      {NAV_CONFIG.map((navItem) => (
        <Link
          inactiveProps={{
            className: '[&_svg]:fill-text-subdued [&_span]:text-text-subdued',
          }}
          activeProps={{
            className:
              'bg-primary-50 [&_svg]:fill-brand-primary [&_span]:text-brand-primary',
          }}
          to={navItem.path}
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
