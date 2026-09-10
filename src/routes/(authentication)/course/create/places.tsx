import CourseForm from '@/components/course/form/course-form'
import TopBar from '@/components/layout/top-bar'
import {
  courseFormStore,
  useCourseFormActions,
} from '@/stores/course-form-store'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import LeftArrowIcon from '@/assets/icons/left-arrow-icon.svg?react'
import { Button } from '@/components/ui/button'
import { useCreateCourse } from '@/hooks/mutations/course'

export const Route = createFileRoute('/(authentication)/course/create/places')({
  beforeLoad: () => {
    const { title, days, actions } = courseFormStore.getState()
    if (!title) throw redirect({ to: '/course/create' })
    if (days.length === 0) actions.addDays()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation(['common', 'course'])
  const { reset } = useCourseFormActions()
  const title = courseFormStore((s) => s.title)
  const navigate = useNavigate()
  const openConfirm = useConfirmModalStore((s) => s.open)
  const { mutate: createCourse } = useCreateCourse()

  const handleBack = () => {
    openConfirm({
      title: t('course:create.stop_course_title'),
      description: t('course:create.stop_course_description'),
      cancelLabel: t('button.cancel'),
      actionLabel: t('course:create.stop_course_confirm_button'),
      onAction: () => {
        reset()
        navigate({ to: '/' })
      },
    })
  }

  return (
    <section className="flex flex-col h-svh">
      <TopBar
        leftSlot={
          <Button variant="icon" size="icon" onClick={handleBack}>
            <LeftArrowIcon />
          </Button>
        }
        title={t('course:form.create_course_title')}
      />
      <CourseForm
        submitLabel={t('course:edit.course_create_submit_button')}
        onSubmit={(items) =>
          createCourse(
            { title, shareYn: false, items },
            {
              onSuccess: (data) => {
                reset()
                navigate({
                  to: `/course/$courseId`,
                  params: { courseId: data.tourCourseId.toString() },
                  replace: true,
                })
              },
            },
          )
        }
      />
    </section>
  )
}
