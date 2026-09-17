import { useTranslation } from 'react-i18next'
import type { TransportationType } from '@/types/course'

interface CourseScheduleItemProps {
  index: number
  placeName: string
  address: string
  description?: string
  imageUrl?: string
  distanceToNext?: string | null
  transportToNext?: TransportationType | null
  isLast?: boolean
  onClick?: () => void
}

// 코스 상세(CourseListItem)와 동일한 타임라인 항목 UI. 클릭 시 장소 상세 페이지로 이동.
function CourseScheduleItem({
  index,
  placeName,
  address,
  description,
  imageUrl,
  distanceToNext,
  transportToNext,
  isLast = false,
  onClick,
}: CourseScheduleItemProps) {
  const { t } = useTranslation('course')

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[13px] font-bold text-white">
          {index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-primary-200" />}
      </div>

      <div className={`flex-1 ${!isLast ? 'pb-3' : ''}`}>
        <div onClick={onClick} className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-body1 font-bold text-text-heading">{placeName}</p>
            <p className="text-label text-text-default font-semibold">
              {address}
            </p>
            <p className="text-label text-text-subdued mt-1 line-clamp-2 text-ellipsis">
              {description}
            </p>
          </div>
          {imageUrl ? (
            <img
              src={imageUrl}
              className="size-21.5 shrink-0 rounded-md object-cover"
            />
          ) : (
            <div className="size-21.5 shrink-0 rounded-md bg-gray-200" />
          )}
        </div>
        {!isLast && transportToNext && (
          <p className="text-label text-brand-primary mt-3">
            {distanceToNext && `${distanceToNext} · `}
            {t('label.transportation', {
              transportation: t(`transportation.${transportToNext}`),
            })}
          </p>
        )}
      </div>
    </div>
  )
}

export default CourseScheduleItem
