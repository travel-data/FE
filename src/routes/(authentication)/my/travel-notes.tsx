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

export const Route = createFileRoute('/(authentication)/my/travel-notes')({
  component: RouteComponent,
})

function formatDateRange(createdAt?: string, updatedAt?: string) {
  const start = createdAt ? createdAt.slice(2, 10).replace(/-/g, '.') : ''
  const end = updatedAt ? updatedAt.slice(2, 10).replace(/-/g, '.') : start

  if (!start) return '날짜 정보 없음'
  return `${start} ~ ${end}`
}

function formatDistance(distanceMeter?: number) {
  if (!distanceMeter) return '거리 정보 없음'
  return `${(distanceMeter / 1000).toFixed(1)}km`
}

function formatDuration(durationSecond?: number) {
  if (!durationSecond) return '소요 시간 정보 없음'

  const hours = Math.floor(durationSecond / 3600)
  const minutes = Math.round((durationSecond % 3600) / 60)

  if (hours <= 0) return `${minutes}분`
  if (minutes <= 0) return `${hours}시간`
  return `${hours}시간 ${minutes}분`
}

function RouteComponent() {
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
        title="나의 여행 노트"
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
              등록된 여행 노트가 없습니다
            </p>
            <Button
              type="button"
              size="sm"
              className="absolute inset-x-0 bottom-2 w-full"
              onClick={() => navigate({ to: '/course/recommend' })}
            >
              코스 추천받으러 가기
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.map((course) => (
              <NoteCourseCard
                key={course.tourCourseId}
                imageUrl={course.thumbnailImg}
                courseName={course.title}
                dateRange={formatDateRange(course.createdAt, course.updatedAt)}
                distance={
                  course.totalDistanceMeter
                    ? formatDistance(course.totalDistanceMeter)
                    : undefined
                }
                duration={
                  course.totalDurationSecond
                    ? formatDuration(course.totalDurationSecond)
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
