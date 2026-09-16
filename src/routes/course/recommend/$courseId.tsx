import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import CourseDetailView from '@/components/course/detail/course-detail-view'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { usePublicCourse } from '@/hooks/queries/shared-course'
import { useInProgressCourse, usePendingCourse } from '@/hooks/queries/course'
import {
  useCreateCourse,
  useUpdateCourseStatus,
} from '@/hooks/mutations/course'
import { toCreateCourseRequest } from '@/mappers/course'
import { useAuth } from '@/stores/auth-store'
import { useRequireAuth } from '@/hooks/use-require-auth'

export const Route = createFileRoute('/course/recommend/$courseId')({
  component: RouteComponent,
})

// 추천 코스 상세(공개 조회) + "이 코스 시작하기"로 내 코스 복제 생성
function RouteComponent() {
  const { t } = useTranslation('course')
  const { courseId } = Route.useParams()
  const navigate = useNavigate()

  const { role } = useAuth()
  const requireAuth = useRequireAuth()
  const isUser = role === 'user'

  // 추천(공개) 코스는 토큰 없이 public 조회 가능
  const { data: course, isPending } = usePublicCourse(courseId, null)
  // 내 코스 조회는 로그인 사용자만 (게스트 401 방지)
  const { data: inProgressCourse } = useInProgressCourse({ enabled: isUser })
  const { data: pendingCourse } = usePendingCourse({ enabled: isUser })
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse()
  const { mutate: updateStatus } = useUpdateCourseStatus()

  if (isPending || !course)
    return (
      <section className="flex flex-col items-center justify-center h-full">
        <Spinner className="size-10 text-brand-primary " />
      </section>
    )

  const handleStart = () => {
    if (isCreating) return
    // 진행 중인 코스가 있으면 새 코스를 만들지 않고 안내만 한다
    if (inProgressCourse) {
      toast.error(t('recommend.in_progress_exists'))
      return
    }
    createCourse(toCreateCourseRequest(course), {
      onSuccess: (res) => {
        // 시작하지 않은(PENDING) 기존 코스는 자동 완료 처리 (진행 중 코스는 건드리지 않음)
        if (pendingCourse) {
          updateStatus({
            courseId: String(pendingCourse.tourCourseId),
            status: 'COMPLETED',
          })
        }
        toast.success(t('recommend.course_created'))
        navigate({
          to: '/course/$courseId',
          params: { courseId: String(res.tourCourseId) },
          replace: true,
        })
      },
      onError: () => toast.error(t('recommend.course_create_failed')),
    })
  }

  return (
    <section className="relative flex h-svh flex-col">
      <div className="flex-1 overflow-y-auto">
        <TopBar leftSlot={<BackButton />} />
        <CourseDetailView courseDetail={course} readOnly={role !== 'user'} />
      </div>

      <div className="shrink-0 px-5 py-4">
        <Button
          className="w-full"
          onClick={() => requireAuth(handleStart)}
          disabled={isCreating}
        >
          {t('recommend.start_course_button')}
        </Button>
      </div>
    </section>
  )
}
