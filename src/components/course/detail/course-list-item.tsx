import { usePlaceDetailSheetStore } from '@/stores/place-detail-sheet-store'
import { TransportationType } from '@/types/course'
import { PlaceCategory } from '@/types/place'
import { useTranslation } from 'react-i18next'

export interface CourseListItemProps {
  index: number
  placeId: number
  placeCategory: PlaceCategory
  name: string
  img: string | null
  address: string
  description: string
  distanceToNext: string | null
  transportToNext: TransportationType | null
  isLast: boolean
}

function CourseListItem({
  index,
  placeId,
  placeCategory,
  name,
  img,
  address,
  description,
  distanceToNext,
  transportToNext,
  isLast,
}: CourseListItemProps) {
  const openPlaceDetail = usePlaceDetailSheetStore((s) => s.open)

  const { t } = useTranslation('course')

  return (
    <>
      <div className="flex gap-3">
        <div className="flex flex-col items-center">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[13px] font-bold text-white">
            {index + 1}
          </div>
          {!isLast && <div className="w-px flex-1 bg-primary-200" />}
        </div>

        <div className={`flex-1 ${!isLast ? 'pb-3' : ''}`}>
          <div
            onClick={() => openPlaceDetail(placeId, placeCategory)}
            className="flex items-start gap-4"
          >
            <div className="flex-1">
              <p className="text-body1 font-bold text-text-heading">{name}</p>
              <p className="text-label text-text-default font-semibold">
                {address}
              </p>
              <p className="text-label text-text-subdued mt-1 line-clamp-2 text-ellipsis">
                {description}
              </p>
            </div>
            {img
              ? <img src={img} className="size-21.5 shrink-0 rounded-md object-cover" />
              : <div className="size-21.5 shrink-0 rounded-md bg-gray-200" />
            }
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
    </>
  )
}

export default CourseListItem
