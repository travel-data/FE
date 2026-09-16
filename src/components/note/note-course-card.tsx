import { useTranslation } from 'react-i18next'

interface NoteCourseCardProps {
  imageUrl?: string
  courseName: string
  dateRange: string
  distance?: string
  duration?: string
  itemCount?: number
  onClick?: () => void
}

function NoteCourseCard({
  imageUrl,
  courseName,
  dateRange,
  distance,
  duration,
  itemCount,
  onClick,
}: NoteCourseCardProps) {
  const { t } = useTranslation('my')

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[12px] bg-primary-50 p-4"
    >
      <div className="flex gap-3">
        <div className="h-18 w-18 shrink-0 overflow-hidden rounded-[8px] bg-white">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={courseName}
              draggable={false}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col items-start gap-1">
          <h3 className="text-body1 font-medium text-text-heading">
            {courseName}
          </h3>
          <p className="text-label text-gray-600">{dateRange}</p>
          {distance && duration ? (
            <p className="text-label text-gray-600">
              {distance} · {duration}
            </p>
          ) : typeof itemCount === 'number' ? (
            <p className="text-label text-gray-600">
              {t('travel_note.place_count', { count: itemCount })}
            </p>
          ) : null}
        </div>
      </div>
    </button>
  )
}

export default NoteCourseCard
