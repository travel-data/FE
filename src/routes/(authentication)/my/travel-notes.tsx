import TopBar from '@/components/layout/top-bar'
import NoteCourseCard from '@/components/note/note-course-card'
import { Button } from '@/components/ui/button'
import {
  Outlet,
  createFileRoute,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'

export const Route = createFileRoute('/(authentication)/my/travel-notes')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname !== '/my/travel-notes') {
    return <Outlet />
  }

  const handleBack = () => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }

    navigate({ to: '/my' })
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
        {MOCK_COURSES.length === 0 ? (
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
            {MOCK_COURSES.map((course) => (
              <NoteCourseCard
                key={course.id}
                courseName={course.courseName}
                dateRange={course.dateRange}
                distance={course.distance}
                duration={course.duration}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

const MOCK_COURSES = [
  {
    id: 1,
    courseName: '신라 야경 코스',
    dateRange: '26-06-09 ~ 26-06-09',
    distance: '5.2km',
    duration: '2시간 30분',
  },
  {
    id: 2,
    courseName: '신라 야경 코스',
    dateRange: '26-06-09 ~ 26-06-09',
    distance: '5.2km',
    duration: '2시간 30분',
  },
  {
    id: 3,
    courseName: '신라 야경 코스',
    dateRange: '26-06-09 ~ 26-06-09',
    distance: '5.2km',
    duration: '2시간 30분',
  },
  {
    id: 4,
    courseName: '신라 야경 코스',
    dateRange: '26-06-09 ~ 26-06-09',
    distance: '5.2km',
    duration: '2시간 30분',
  },
]
