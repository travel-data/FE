import { createFileRoute, Navigate } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useInProgressCourse } from '@/hooks/queries/course'
import { usePendingCourseGuard } from '@/hooks/use-pending-course-guard'
import TopBar from '@/components/layout/top-bar'
import BackButton from '@/components/button/back-button'

export const Route = createFileRoute('/(authentication)/course/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation(['home', 'course'])
  const { data: inProgressCourse, isPending } = useInProgressCourse()
  const { handleCtaClick, pendingModal } = usePendingCourseGuard({
    replace: true,
  })

  if (isPending)
    return (
      <section className="flex flex-col h-svh items-center justify-center">
        <Spinner className="text-brand-primary size-10" />
      </section>
    )

  if (inProgressCourse)
    return (
      <Navigate
        to="/course/$courseId/progress"
        params={{ courseId: String(inProgressCourse.tourCourseId) }}
        replace
      />
    )

  return (
    <section className="relative flex flex-col justify-between h-svh text-text-default">
      <TopBar leftSlot={<BackButton />} />
      <div className="flex-1 px-5">
        <h3 className="text-title1 text-text-default mb-2">
          <Trans
            i18nKey={'empty.title'}
            ns="course"
            components={{ br: <br /> }}
          />
        </h3>
        <p className="text-body2 text-text-subdued">
          <Trans
            i18nKey={'empty.description'}
            ns="course"
            components={{ br: <br /> }}
          />
        </p>
      </div>

      <div className="flex flex-col items-center justify-center p-5 gap-2">
        <Button
          size="md"
          className="w-full"
          onClick={() => handleCtaClick('/course/recommend')}
        >
          {t('course.cta_recommend')}
        </Button>
        <Button
          size="md"
          className="w-full"
          variant={'outline'}
          onClick={() => handleCtaClick('/course/create')}
        >
          {t('course.cta_create_course')}
        </Button>
      </div>

      {pendingModal}
    </section>
  )
}
