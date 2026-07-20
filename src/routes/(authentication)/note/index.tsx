import { createFileRoute, useNavigate } from '@tanstack/react-router'
import TopBar from '@/components/layout/top-bar'
import BottomNavBar from '@/components/layout/bottom-nav-bar'
import NoteCourseCard from '@/components/note/note-course-card'

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

      <main className="flex-1 overflow-y-auto px-5 pb-24">
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
      </main>

      <BottomNavBar />
    </div>
  )
}
