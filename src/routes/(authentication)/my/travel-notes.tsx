import TopBar from '@/components/layout/top-bar'
import NoteCourseCard from '@/components/note/note-course-card'
import { Button } from '@/components/ui/button'
import { useGetCourseList } from '@/hooks/queries/course'
import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  formatCourseDateRange,
  formatCourseDistance,
  formatCourseDuration,
} from '@/lib/format-course'

export const Route = createFileRoute('/(authentication)/my/travel-notes')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('my')
  const navigate = useNavigate()
  const location = useLocation()
  const { data: courseList, isLoading } = useGetCourseList()
  const courses = courseList?.items ?? []

  if (location.pathname !== '/my/travel-notes') {
    return <Outlet />
  }

  const handleBack = () => {
    navigate({ to: '/my', replace: true })
  }

  const handleCourseClick = (courseId: number) => {
    navigate({
      to: '/my/travel-notes/$courseId',
      params: { courseId: String(courseId) },
    })
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar
        title={t('travel_note.my_title')}
        leftSlot={
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={handleBack}
            className="flex size-8 items-center justify-center rounded-full text-text-heading"
          >
            <ChevronLeft className="size-6" />
          </button>
        }
      />

      <main className="flex flex-1 flex-col overflow-y-auto px-5 pb-24">
        {!isLoading && courses.length === 0 ? (
          <div className="relative flex flex-1 items-center justify-center">
            <p className="text-body1 text-text-default">
              {t('travel_note.fallback')}
            </p>
            <Button
              type="button"
              size="sm"
              className="absolute inset-x-0 bottom-2 w-full"
              onClick={() => navigate({ to: '/course/recommend' })}
            >
              {t('travel_note.course_cta_button')}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.map((course) => (
              <NoteCourseCard
                key={course.tourCourseId}
                imageUrl={course.thumbnailImg}
                courseName={course.title}
                dateRange={formatCourseDateRange(
                  course.createdAt,
                  course.updatedAt,
                )}
                distance={
                  course.totalDistanceMeter
                    ? formatCourseDistance(course.totalDistanceMeter)
                    : undefined
                }
                duration={
                  course.totalDurationSecond
                    ? formatCourseDuration(course.totalDurationSecond)
                    : undefined
                }
                itemCount={course.itemCount}
                onClick={() => handleCourseClick(course.tourCourseId)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
