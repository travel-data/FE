import { createFileRoute } from '@tanstack/react-router'

import Symbol from '@/assets/icons/symbol.svg?react'
import { Button } from '@/components/ui/button'
import { Trans, useTranslation } from 'react-i18next'
import BottomNavBar from '@/components/layout/bottom-nav-bar'
import RecommedCourseSection from '@/components/main/recommed-course-section'
import FestivalSection from '@/components/main/festival-section'
import ChangeLanguageButton from '@/components/button/change-language-button'
import { useInProgressCourse } from '@/hooks/queries/course'
import { usePendingCourseGuard } from '@/hooks/use-pending-course-guard'
import CourseProgressCard, {
  CourseProgressCardFallback,
} from '@/components/main/course-progress-card'

export const Route = createFileRoute('/(authentication)/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation('home')

  const { data: inProgressCourse, isPending } = useInProgressCourse()
  const { handleCtaClick, pendingModal } = usePendingCourseGuard()

  return (
    <div className="relative flex flex-col h-svh text-text-default">
      <div className="flex-1 overflow-y-auto  py-4 pb-24">
        <section className="px-5">
          <header className="flex items-center justify-between">
            <Symbol />

            <ChangeLanguageButton />
          </header>

          {isPending ? (
            <CourseProgressCardFallback />
          ) : inProgressCourse ? (
            <CourseProgressCard courseId={inProgressCourse.tourCourseId} />
          ) : (
            <>
              <p className="text-title2 py-4">
                <Trans
                  i18nKey="greeting"
                  ns="home"
                  components={[<br />, <span className="text-brand-primary" />]}
                />
              </p>
              <Button
                size="sm"
                className="w-full mb-2"
                onClick={() => handleCtaClick('/course/recommend')}
              >
                {t('course.cta_recommend')}
              </Button>
              <Button
                size="sm"
                className="w-full"
                variant={'outline'}
                onClick={() => handleCtaClick('/course/create')}
              >
                {t('course.cta_create_course')}
              </Button>
            </>
          )}
          <div className="flex items-center gap-4 py-4">
            {/* TODO: 오늘의 스토리 카드 */}
            <div className="flex-1 aspect-square rounded-lg bg-gray-200"></div>
            {/* TODO: 오늘 경주 날씨 카드 */}
            <div className="flex-1 aspect-square rounded-lg bg-gray-200"></div>
          </div>
        </section>

        <RecommedCourseSection />
        <FestivalSection />
      </div>

      <BottomNavBar />

      {pendingModal}
    </div>
  )
}
