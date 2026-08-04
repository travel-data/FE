import CalendarIcon from '@/assets/icons/calendar-icon.svg?react'
import { useFestivalsQuery } from '@/hooks/queries/festival'
import { cn } from '@/lib/utils'
import { FestivalResponse } from '@/types/festival'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

function FestivalSection() {
  const { t } = useTranslation('home')

  const { data, isPending } = useFestivalsQuery()

  return (
    <section className="py-6 bg-gray-50 flex flex-col items-center justify-center gap-2.5">
      <div className="text-center">
        <h3 className="text-body2 font-bold">{t('festival_section.title')}</h3>
        <p className="text-text-subdued text-caption">
          {t('festival_section.description')}
        </p>
      </div>

      <ul className="w-full flex overflow-x-auto gap-4 px-5">
        {isPending &&
          Array.from({ length: 3 }).map((_, idx) => (
            <FestivalListItemSkeleton key={idx} />
          ))}
        {!isPending &&
          data &&
          data?.map((festival) => (
            <li key={festival.spotId} className="w-[75%] shrink-0">
              <FestivalListItem {...festival} />
            </li>
          ))}
      </ul>
    </section>
  )
}

export default FestivalSection

function FestivalListItem({
  name,
  eventEndDate,
  eventStartDate,
  img,
  status,
  spotId,
}: FestivalResponse) {
  return (
    <Link
      to="/festival/$festivalId"
      params={{ festivalId: String(spotId) }}
      className="flex flex-col gap-2 w-full"
    >
      <div className="rounded-lg overflow-hidden relative w-full h-47.5">
        <img src={img} alt={name} className="w-full h-full" />
      </div>

      <div>
        <p className="text-label font-bold">{name}</p>
        <p className="text-caption text-text-subdued flex gap-0.5 items-center">
          <CalendarIcon />
          {eventStartDate}~{eventEndDate}
          <span className="mx-0.5">·</span>
          <span
            className={cn(
              status === 'ONGOING' ? 'text-brand-primary' : 'text-text-subdued',
            )}
          >
            {status === 'ONGOING' ? '진행 중' : '진행 예정'}
          </span>
        </p>
      </div>
    </Link>
  )
}

function FestivalListItemSkeleton() {
  return (
    <div className="flex flex-col gap-2 shrink w-[75%]">
      <div className="rounded-lg bg-gray-300 animate-pulse w-73 h-47.5" />

      <div>
        <div className="bg-gray-300 w-35.25 h-4 rounded-xs animate-pulse mb-1.5" />
        <div className="bg-gray-300 w-36 h-4 rounded-xs animate-pulse" />
      </div>
    </div>
  )
}
