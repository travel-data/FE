import { Trash2 } from 'lucide-react'
import BackButton from '../button/back-button'

interface CourseDetailHeaderProps {
  backgroundImage?: string
  courseName: string
  dateRange: string
  onBack: () => void
  onDelete: () => void
}

function CourseDetailHeader({
  backgroundImage,
  courseName,
  dateRange,
  onDelete,
}: CourseDetailHeaderProps) {
  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="relative flex h-60 flex-col justify-between bg-gray-100 p-5"
    >
      <div className="flex items-start justify-between z-10">
        <BackButton fallback="/my/travel-notes" />

        <button
          type="button"
          onClick={onDelete}
          className="flex size-11 items-center justify-center rounded-full bg-white"
        >
          <Trash2 className="size-[18px]" />
        </button>
      </div>
      <div className="absolute inset-0 bg-linear-to-b to-black/40  from-transparent bg-opacity-30" />

      <div className="flex flex-col items-start z-10">
        <h2 className="text-title2 text-white">{courseName}</h2>
        <p className="text-label text-white">{dateRange}</p>
      </div>
    </div>
  )
}

export default CourseDetailHeader
