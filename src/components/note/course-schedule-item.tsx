interface CourseScheduleItemProps {
  time: string
  placeName: string
  category: string
  memo?: string
  transportation: string
  imageUrl?: string
  isFirst?: boolean
  isLast?: boolean
}

function CourseScheduleItem({
  time,
  placeName,
  category,
  memo,
  transportation,
  imageUrl,
  isFirst,
  isLast,
}: CourseScheduleItemProps) {
  return (
    <div className="relative grid grid-cols-[auto_minmax(0,1fr)_72px] gap-3 overflow-visible px-5 py-4">
      {!isLast && (
        <div className="absolute left-[27px] top-8 z-0 h-full w-0.5 bg-primary-400" />
      )}

      <div className="relative flex shrink-0 items-start gap-1 pt-2">
        <div className="relative z-10 size-4 shrink-0 rounded-full bg-primary-400" />
        <span className="text-caption text-primary-400">{time}</span>
      </div>

      <div className="flex min-w-0 flex-col gap-2 overflow-hidden py-2">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="min-w-0 truncate text-title3 font-medium text-text-heading">
            {placeName}
          </h3>
          <span className="shrink-0 rounded-[40px] bg-brand-primary px-3 py-1 text-caption text-primary-50">
            {category}
          </span>
        </div>

        <p className="min-w-0 truncate text-caption text-text-heading">
          {memo || '작성된 메모가 존재하지 않습니다.'}
        </p>

        <span className="min-w-0 truncate text-caption text-text-subdued">
          {transportation}
        </span>
      </div>

      <div className="mt-2 size-18 shrink-0 justify-self-end overflow-hidden rounded-[8px] bg-gray-100">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={placeName}
            className="h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  )
}

export default CourseScheduleItem
