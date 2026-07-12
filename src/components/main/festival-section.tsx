import CalendarIcon from '@/assets/icons/calendar-icon.svg?react'
import { useTranslation } from 'react-i18next'

// TODO: MOCK 데이터 교체
function FestivalSection() {
  const { t } = useTranslation('home')

  return (
    <section className="py-6 bg-gray-50 flex flex-col items-center justify-center gap-2.5">
      <div className="text-center">
        <h3 className="text-body2 font-bold">{t('festival_section.title')}</h3>
        <p className="text-text-subdued text-caption">
          {t('festival_section.description')}
        </p>
      </div>

      <ul className="w-full flex overflow-x-auto gap-4 px-5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <FestivalListItem key={idx} />
        ))}
      </ul>
    </section>
  )
}

export default FestivalSection

function FestivalListItem() {
  return (
    <li className="flex flex-col gap-2 shrink-0 w-[75%]">
      <div className="rounded-lg overflow-hidden relative w-full h-47.5">
        <span className="absolute rounded-full top-4 left-4 px-3 py-0.5 bg-white text-caption font-bold">
          행사/이벤트
        </span>
        <div className="w-full h-full bg-gray-300"></div>
      </div>

      <div>
        <p className="text-label font-bold">2026 봉황대 뮤직 스퀘어</p>
        <span className="text-caption text-text-subdued flex gap-0.5 items-center">
          <CalendarIcon />
          2026-06-05~2026-08-28
        </span>
      </div>
    </li>
  )
}
