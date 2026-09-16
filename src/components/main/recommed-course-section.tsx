import { useTranslation } from 'react-i18next'
import CourseItem from '../course/course-item'
import { useFeaturedCourses } from '@/hooks/queries/course'

const FEATURED_SIZE = 4

// CourseItem과 동일한 레이아웃(정사각 이미지 + 제목 1줄 + 장소수)으로 시프트 방지
function CourseItemSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-30 w-full rounded-lg bg-gray-200 animate-pulse" />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  )
}

function RecommedCourseSection() {
  const { t } = useTranslation('home')
  const { data: courses, isPending } = useFeaturedCourses(FEATURED_SIZE)

  // 추천 코스가 없으면 섹션 자체를 숨긴다 (로딩 중에는 스켈레톤 노출)
  if (!isPending && (!courses || courses.length === 0)) return null

  return (
    <section className="py-4 px-5">
      <div className="mb-4 flex flex-col">
        <h4 className="text-body2 font-bold">
          {t('recommend_course_section.title')}
        </h4>
        <p className="text-text-subdued text-label">
          {t('recommend_course_section.description')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        {isPending
          ? Array.from({ length: FEATURED_SIZE }).map((_, idx) => (
              <CourseItemSkeleton key={idx} />
            ))
          : courses?.map((course) => (
              <CourseItem key={course.tourCourseId} course={course} />
            ))}
      </div>
    </section>
  )
}

export default RecommedCourseSection
