interface NoteCourseCardProps {
  imageUrl?: string
  courseName: string
  dateRange: string
  distance: string
  duration: string
  onClick?: () => void
}

function NoteCourseCard({
  imageUrl,
  courseName,
  dateRange,
  distance,
  duration,
  onClick,
}: NoteCourseCardProps) {
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
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col items-start gap-1">
          <h3 className="text-body1 font-medium text-text-heading">
            {courseName}
          </h3>
          <p className="text-label text-gray-600">{dateRange}</p>
          <p className="text-label text-gray-600">
            {distance} · {duration}
          </p>
        </div>
      </div>
    </button>
  )
}

export default NoteCourseCard
