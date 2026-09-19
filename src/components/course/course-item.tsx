import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import ImageFallback from '@/components/image-fallback'
import type { CourseListDetail } from '@/types/course'

function CourseItem({ course }: { course: CourseListDetail }) {
  const { t } = useTranslation('home')

  return (
    <Link
      to="/course/recommend/$courseId"
      params={{ courseId: String(course.tourCourseId) }}
      className="flex flex-col gap-2"
    >
      <div className="relative">
        <span className="absolute top-3 left-3 bg-white font-bold text-label px-4 py-0.5 rounded-full text-text-default">
          {t('recommend_course_section.item_count', {
            count: course.itemCount,
          })}
        </span>
        {course.thumbnailImg ? (
          <img
            src={course.thumbnailImg}
            alt={course.title}
            className="w-full h-30 rounded-lg object-cover"
          />
        ) : (
          <ImageFallback className="h-30 w-full rounded-lg" />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-body2 font-bold line-clamp-1">{course.title}</p>
      </div>
    </Link>
  )
}

export default CourseItem
