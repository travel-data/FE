import LeftArrowIcon from '@/assets/icons/left-arrow-icon.svg?react'

import TopBar from '@/components/layout/top-bar'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import CourseForm from '@/components/course/form/course-form'
import { getCourseDetail } from '@/api/course'
import { queryClient } from '@/lib/query-client'
import { QUERY_KEY } from '@/constants/query-key'
import {
  courseFormStore,
  useCourseFormActions,
} from '@/stores/course-form-store'
import { useUpdateCourse } from '@/hooks/mutations/course'
import { CourseItemPayload } from '@/types/course'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute(
  '/(authentication)/course/$courseId_/edit',
)({
  loader: async ({ params: { courseId } }) => {
    const data = await queryClient.ensureQueryData({
      queryKey: QUERY_KEY.course.detail(courseId),
      queryFn: () => getCourseDetail(courseId),
      staleTime: Infinity,
    })
    courseFormStore.getState().actions.initFormDetail(data)
    return { shareYn: data.shareYn, title: data.title }
  },
  staleTime: Infinity,
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('course')
  const { reset, setSelectedDayIndex } = useCourseFormActions()
  const { courseId } = Route.useParams()
  const { shareYn, title } = Route.useLoaderData()
  const { mutate: updateCourse } = useUpdateCourse()
  const navigate = useNavigate()
  const router = useRouter()

  const handleSubmit = (items: CourseItemPayload[]) => {
    updateCourse(
      { courseId, body: { title, shareYn, items } },
      {
        onSuccess: () => {
          setSelectedDayIndex(0)
          navigate({
            to: '/course/$courseId',
            params: { courseId },
            replace: true,
          })
        },
      },
    )
  }

  const handleBack = () => {
    reset()
    router.invalidate()
    navigate({ to: '/course/$courseId', params: { courseId }, replace: true })
  }
  return (
    <section className="flex h-svh flex-col">
      <TopBar
        leftSlot={
          <Button variant="icon" size="icon" onClick={handleBack}>
            <LeftArrowIcon />
          </Button>
        }
        title={t('edit.course_edit')}
      />
      <CourseForm onSubmit={handleSubmit} isEditMode />
    </section>
  )
}
