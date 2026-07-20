import { ChevronLeft, Trash2 } from 'lucide-react'

interface CourseDetailHeaderProps {
  courseName: string
  dateRange: string
  tags: string[]
  onBack: () => void
  onDelete: () => void
}

function CourseDetailHeader({
  courseName,
  dateRange,
  tags,
  onBack,
  onDelete,
}: CourseDetailHeaderProps) {
  return (
    <div className="flex h-50 flex-col justify-between bg-primary-50 p-5">
      <div className="flex items-start justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex size-11 items-center justify-center rounded-full bg-white"
        >
          <ChevronLeft className="size-[18px]" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="flex size-11 items-center justify-center rounded-full bg-white"
        >
          <Trash2 className="size-[18px]" />
        </button>
      </div>

      <div className="flex flex-col items-start">
        <h2 className="text-title2 text-text-heading">{courseName}</h2>
        <p className="mt-1 text-label text-gray-700">{dateRange}</p>

        <div className="mt-3 flex gap-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[8px] bg-brand-primary px-3 py-1 text-caption text-primary-50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CourseDetailHeader
