import CourseDateSelector from '@/components/note/course-date-selector'
import CourseDetailHeader from '@/components/note/course-detail-header'
import CourseDetailTabs from '@/components/note/course-detail-tabs'
import CourseScheduleItem from '@/components/note/course-schedule-item'
import StoryCard from '@/components/note/story-card'
import { Spinner } from '@/components/ui/spinner'
import { useGetCourseDetail } from '@/hooks/queries/course'
import { useDeleteCourse } from '@/hooks/mutations/course'
import { useStoryCardDetailsQueries } from '@/hooks/queries/story-card'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'
import type { CourseDetailItem } from '@/types/course'
import { formatCourseDateRange } from '@/lib/format-course'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute(
  '/(authentication)/my/travel-notes/$courseId',
)({
  validateSearch: (search: Record<string, unknown>): { tab?: 'story' } => ({
    tab: search.tab === 'story' ? 'story' : undefined,
  }),
  component: RouteComponent,
})

function getTotalDays(items: CourseDetailItem[]) {
  return Math.max(...items.map((item) => item.dayNumber), 1)
}

function RouteComponent() {
  const { t } = useTranslation(['my', 'common'])
  const navigate = useNavigate()
  const { courseId } = Route.useParams()
  const { tab } = Route.useSearch()
  const [activeTab, setActiveTab] = useState<'timeline' | 'story'>(
    tab ?? 'timeline',
  )
  const [selectedDay, setSelectedDay] = useState(1)
  const { data: courseDetail, isPending } = useGetCourseDetail(courseId)
  const deleteCourseMutation = useDeleteCourse()
  const openConfirmModal = useConfirmModalStore((state) => state.open)

  const storySpotIds = useMemo(
    () =>
      courseDetail?.items
        .filter((item) => item.category === 'TOUR_SPOT' && item.spotId)
        .map((item) => item.spotId as number) ?? [],
    [courseDetail],
  )
  const storyCardQueries = useStoryCardDetailsQueries(storySpotIds, {
    enabled: activeTab === 'story',
  })
  const storyCards = storyCardQueries.flatMap((query) =>
    query.data ? [query.data] : [],
  )
  const areStoryCardsLoading = storyCardQueries.some((query) => query.isPending)

  const schedules = useMemo(() => {
    if (!courseDetail) return []

    return courseDetail.items
      .filter((item) => item.dayNumber === selectedDay)
      .sort((a, b) => a.itemOrder - b.itemOrder)
  }, [courseDetail, selectedDay])

  const handleBack = () => {
    navigate({ to: '/my/travel-notes', replace: true })
  }

  const handleDelete = () => {
    if (deleteCourseMutation.isPending) return

    openConfirmModal({
      title: t('travel_note.delete_title'),
      description: t('travel_note.delete_description'),
      actionLabel: t('common:button.delete'),
      onAction: () => {
        deleteCourseMutation.mutate(courseId, {
          onSuccess: handleBack,
          onError: () =>
            openConfirmModal({
              title: '여행 코스를 삭제하지 못했습니다.',
              description: '잠시 후 다시 시도해 주세요.',
              actionLabel: '확인',
              onAction: () => undefined,
            }),
        })
      },
    })
  }

  const handlePlaceClick = (item: CourseDetailItem) => {
    navigate({
      to: '/my/travel-notes/$courseId/place/$placeId',
      params: {
        courseId,
        placeId: String(item.spotId ?? item.nearbyPlaceId ?? item.itemId),
      },
      search: { category: item.category },
    })
  }

  if (isPending || !courseDetail)
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-10 text-brand-primary" />
      </div>
    )

  const totalDays = getTotalDays(courseDetail.items)

  return (
    <div className="relative flex h-svh flex-col">
      <CourseDetailHeader
        backgroundImage={courseDetail.items[0]?.img || undefined}
        courseName={courseDetail.title}
        dateRange={formatCourseDateRange(
          courseDetail.createdAt,
          courseDetail.updatedAt,
        )}
        onBack={handleBack}
        onDelete={handleDelete}
      />

      <main className="flex-1 overflow-y-auto bg-white pb-24">
        <CourseDetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'timeline' && (
          <>
            <CourseDateSelector
              selectedDay={selectedDay}
              totalDays={totalDays}
              onDayChange={setSelectedDay}
            />
            <div className="relative flex flex-col px-5">
              {schedules.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center">
                  <p className="text-body1 text-text-default">
                    {t('travel_note.empty_places')}
                  </p>
                </div>
              ) : (
                schedules.map((schedule, index) => (
                  <CourseScheduleItem
                    key={schedule.itemId}
                    index={index}
                    placeName={schedule.name}
                    address={schedule.address}
                    description={schedule.overview ?? undefined}
                    imageUrl={schedule.img ?? undefined}
                    transportToNext={
                      schedules[index + 1]?.transportType ?? null
                    }
                    isLast={index === schedules.length - 1}
                    onClick={() => handlePlaceClick(schedule)}
                  />
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'story' && (
          <div className="flex flex-col gap-4 px-5">
            {areStoryCardsLoading ? (
              <div className="flex min-h-40 items-center justify-center">
                <Spinner className="size-10 text-brand-primary" />
              </div>
            ) : storyCards.length === 0 ? (
              <p className="py-12 text-center text-body1 text-text-subdued">
                {t('travel_note.empty_storycards')}
              </p>
            ) : (
              storyCards.map((storyCard) => (
                <StoryCard
                  key={storyCard.storyId}
                  imageUrl={storyCard.imageUrl}
                  placeName={storyCard.tourSpotName}
                  subtitle={storyCard.subTitle || storyCard.title}
                  storyTitle={storyCard.storyTitle}
                  onClick={() =>
                    navigate({
                      to: '/storycards/$spotId',
                      params: { spotId: String(storyCard.spotId) },
                      search: { from: 'travel-notes', courseId },
                    })
                  }
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
