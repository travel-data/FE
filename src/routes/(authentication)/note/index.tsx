import { createFileRoute, useNavigate } from '@tanstack/react-router'
import TopBar from '@/components/layout/top-bar'
import BottomNavBar from '@/components/layout/bottom-nav-bar'
import NoteCourseCard from '@/components/note/note-course-card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(authentication)/note/')({
  component: RouteComponent,
})

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

function RouteComponent() {
  const navigate = useNavigate()

  const handleCourseClick = (courseId: number) => {
    navigate({ to: '/note/$courseId', params: { courseId: String(courseId) } })
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar title="여행 노트" />

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

      <BottomNavBar />
    </div>
  )
}
