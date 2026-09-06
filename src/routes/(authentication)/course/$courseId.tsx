import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Pencil } from 'lucide-react'
import BackButton from '@/components/button/back-button'
import { Button } from '@/components/ui/button'
import TopBar from '@/components/layout/top-bar'
import KakaoRouteMap from '@/components/course/result/kakao-route-map'
import CourseSummary from '@/components/course/detail/course-summary'
import CourseDayTabs from '@/components/course/detail/course-day-tabs'
import CourseActionBar from '@/components/course/detail/course-action-bar'
import ShareLinkDrawer from '@/components/course/detail/share-link-drawer'
import { useTranslation } from 'react-i18next'
import { CourseDetailItem } from '@/types/course'
import { Spinner } from '@/components/ui/spinner'
import { useGetCourseDetail } from '@/hooks/queries/course'
import { useShareLink } from '@/hooks/use-share-link'
import { useAdvanceCourse, useUpdateCourseStatus } from '@/hooks/mutations/course'

export const Route = createFileRoute('/(authentication)/course/$courseId')({
  component: RouteComponent,
})

function buildPlace(item: CourseDetailItem, nextItem?: CourseDetailItem) {
  return {
    id: item.itemId,
    placeId: (item.spotId ?? item.nearbyPlaceId)!,
    placeCategory: item.category,
    name: item.name,
    img: item.img,
    address: item.address,
    description: item.overview ?? '',
    distanceToNext: null,
    transportToNext: nextItem?.transportType ?? null,
  }
}

function RouteComponent() {
  const { t } = useTranslation('course')
  const { courseId } = Route.useParams()
  const navigate = useNavigate()

  const [selectedDay, setSelectedDay] = useState(1)

  const { data: courseDetail, isPending } = useGetCourseDetail(courseId)

  const { mutateAsync: startCourse } = useAdvanceCourse()
  const { mutateAsync: updateStatus } = useUpdateCourseStatus()
  const days = useMemo(() => {
    if (!courseDetail) return []
    const grouped = new Map<number, CourseDetailItem[]>()

    for (const item of courseDetail.items) {
      if (!grouped.has(item.dayNumber)) grouped.set(item.dayNumber, [])
      grouped.get(item.dayNumber)!.push(item)
    }
    return Array.from(grouped.entries()).map(([dayNumber, items]) => {
      const sorted = [...items].sort((a, b) => a.itemOrder - b.itemOrder)
      return {
        day: dayNumber,
        label: String(dayNumber),
        places: sorted.map((item, idx) => buildPlace(item, sorted[idx + 1])),
      }
    })
  }, [courseDetail])

  const { isSharing, sharingActions, onShare, shareLinkDrawerProps } =
    useShareLink({ shareYn: courseDetail?.shareYn ?? false, courseId })

  const currentDayData = days.find((d) => d.day === selectedDay) ?? days[0]

  const mapPlaces = useMemo(
    () =>
      currentDayData?.places.map(({ id }) => {
        const item = courseDetail?.items.find((i) => i.itemId === id)!
        return { id, lat: item.latitude, lng: item.longitude }
      }) ?? [],
    [currentDayData, courseDetail],
  )

  if (isPending || !courseDetail) return <Spinner className="m-auto mt-20" />

  return (
    <>
      <section className="relative flex h-svh flex-col">
        <div className="flex-1 overflow-y-auto">
          <TopBar
            leftSlot={<BackButton />}
            rightSlot={
              courseDetail.status === 'PENDING' && (
                <Button
                  onClick={() =>
                    navigate({
                      to: '/course/$courseId/edit',
                      params: { courseId },
                    })
                  }
                  variant="icon"
                  size="icon"
                >
                  <Pencil className="text-text-heading" />
                </Button>
              )
            }
          />

          <CourseSummary
            name={courseDetail.title}
            description=""
            courseTypeLabel={t('label.course')}
          />

          <div className="mx-5 mt-4 h-48 overflow-hidden rounded-xl">
            <KakaoRouteMap key={selectedDay} places={mapPlaces} />
          </div>

          <div className="mt-4 px-5">
            <CourseDayTabs
              days={days}
              selectedDay={selectedDay}
              onDayChange={setSelectedDay}
            />
          </div>
        </div>

        <CourseActionBar
          isInProgress={courseDetail.status === 'IN_PROGRESS'}
          isSharing={isSharing}
          sharingActions={sharingActions}
          onShare={onShare}
          onStart={async () => {
            await Promise.all([
              startCourse({
                courseId,
                complete: [],
                start: days[0].places[0].id,
              }),
              updateStatus({ courseId, status: 'IN_PROGRESS' }),
            ])
            navigate({
              to: '/course/$courseId/progress',
              params: { courseId },
              replace: true,
            })
          }}
        />
      </section>

      <ShareLinkDrawer {...shareLinkDrawerProps} />
    </>
  )
}
