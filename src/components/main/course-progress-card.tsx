import { useGetCourseDetail } from '@/hooks/queries/course'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import RightArrowIcon from '@/assets/icons/right-arrow-icon.svg?react'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import { useNavigate } from '@tanstack/react-router'

interface CourseProgressCardProps {
  courseId: number
}

export function CourseProgressCardFallback() {
  return (
    <div className="flex min-h-57.5 mt-4 items-center justify-center">
      <Spinner className="size-10 text-brand-primary" />
    </div>
  )
}

function CourseProgressCard({ courseId }: CourseProgressCardProps) {
  const navigate = useNavigate()
  const { t } = useTranslation('home')
  const { data: detail, isPending } = useGetCourseDetail(String(courseId))

  if (isPending || !detail) {
    return <CourseProgressCardFallback />
  }

  const currentPlace =
    detail.items.find((item) => item.status === 'IN_PROGRESS') ?? null

  const currentDaysPlace = currentPlace
    ? detail.items.filter((item) => item.dayNumber === currentPlace.dayNumber)
    : []
  const currentDaysCompletePlace = currentDaysPlace.filter(
    (item) => item.status === 'COMPLETED',
  )

  const handleGoToProgress = () => {
    navigate({
      to: '/course/$courseId/progress',
      params: { courseId: String(courseId) },
    })
  }
  return (
    <div className="bg-brand-primary/5 mt-4 p-5 -mx-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-brand-primary text-label font-semibold">
            {t('course_card.inprogress_course_label')}
          </span>
          <h4 className="text-title2 text-text-default">{`${detail.title} - ${t('course_card.progress_days', { days: currentPlace?.dayNumber })}`}</h4>
        </div>

        <Button variant={'icon'} size="icon" onClick={handleGoToProgress}>
          <RightArrowIcon className="fill-text-heading size-3" />
        </Button>
      </div>

      {currentPlace && (
        <>
          <div
            onClick={handleGoToProgress}
            className="p-2.5 flex items-center gap-3 bg-white rounded-md mb-3"
          >
            {currentPlace.img ? (
              <img src={currentPlace.img} className="size-15 rounded-md" />
            ) : (
              <div className="size-15 bg-text-subdued rounded-md" />
            )}

            <div className="flex flex-col">
              <p className="text-body1 font-semibold text-text-default">
                {currentPlace.name}
              </p>
              <span className="flex items-center text-text-subdued text-label ">
                <MarkerIcon className="size-3 mr-0.5" />
                <span className="text-ellipsis line-clamp-1">
                  {currentPlace.address}
                </span>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-brand-primary text-label font-semibold">
                {t('course_card.progress_rate_label')}
              </p>
              <span className="text-brand-primary text-label font-semibold">
                {`${currentDaysCompletePlace.length}/${currentDaysPlace.length}`}
              </span>
            </div>

            <div className="w-full rounded-full h-2.5 bg-white relative">
              <div
                style={{
                  width: `${
                    currentDaysPlace.length
                      ? (currentDaysCompletePlace.length /
                          currentDaysPlace.length) *
                        100
                      : 0
                  }%`,
                }}
                className="absolute rounded-full bg-brand-primary h-2.5 left-0 top-0"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CourseProgressCard
