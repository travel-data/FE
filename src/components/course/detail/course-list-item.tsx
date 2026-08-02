import { useTranslation } from 'react-i18next'

export type TransportationType = 'walk' | 'car' | 'bicycle' | 'public_transportation'

export interface CourseListItemProps {
  index: number
  name: string
  address: string
  description: string
  distanceToNext: string | null
  transportToNext: TransportationType | null
  isLast: boolean
}

function CourseListItem({
  index,
  name,
  address,
  description,
  distanceToNext,
  transportToNext,
  isLast,
}: CourseListItemProps) {
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
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-body1 font-bold text-text-heading">{name}</p>
            <p className="text-label text-text-default font-semibold">{address}</p>
            <p className="text-caption text-text-subdued mt-1">{description}</p>
          </div>
          <div className="size-21.5 shrink-0 rounded-md bg-gray-200" />
        </div>
        {!isLast && distanceToNext && transportToNext && (
          <p className="text-label text-brand-primary mt-3">
            {distanceToNext} ·{' '}
            {t('label.transportation', {
              transportation: t(`transportation.${transportToNext}`),
            })}
          </p>
        )}
      </div>
    </div>
  )
}

export default CourseListItem
