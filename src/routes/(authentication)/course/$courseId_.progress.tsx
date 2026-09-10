import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import PlaceBookmarkButton from '@/components/place/place-bookmark-button'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link, Navigate } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import { useState } from 'react'
import NextPlaceSheet from '@/components/course/progress/next-place-sheet'
import CompletionSheet from '@/components/course/progress/completion-sheet'
import CourseStopButton from '@/components/course/progress/course-stop-button'
import { useCourseProgress } from '@/hooks/use-course-progress'
import { usePlaceDetail } from '@/hooks/queries/place'
import TourSpotContent from '@/components/course/progress/tour-spot-content'
import TourSpotMemoDialog from '@/components/place/tour-spot-memo-dialog'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

export const Route = createFileRoute(
  '/(authentication)/course/$courseId_/progress',
)({
  component: RouteComponent,
})

interface CoursePlaceHeaderProps {
  courseId: string
  name: string
  address: string
  latitude: number
  longitude: number
  order: number
}

function CoursePlaceHeader({
  courseId,
  name,
  address,
  latitude,
  longitude,
  order,
}: CoursePlaceHeaderProps) {
  const { t } = useTranslation('course')
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-primary-400 text-label mb-1">
            {t('label.course_in_progress', { count: order })}
          </p>
          <h3 className="flex items-center gap-1.5 text-title3">{name}</h3>
        </div>
        <CourseStopButton courseId={courseId} />
      </div>
      <div className="flex items-center gap-0.5 text-text-subdued text-label">
        <MarkerIcon className="size-3" />
        <span>
          {address} · {''}
          <a
            className="text-brand-primary font-bold"
            target="_blank"
            href={`http://m.map.kakao.com/scheme/look?p=${latitude},${longitude}`}
          >
            {t('button.directions', { ns: 'course' })}
          </a>
        </span>
      </div>
    </div>
  )
}

function RouteComponent() {
  const [memoOpen, setMemoOpen] = useState(false)
  const { t } = useTranslation('place')
  const { courseId } = Route.useParams()

  useKakaoLoader({ appkey: import.meta.env.VITE_KAKAO_JS_KEY ?? '' })

  const {
    isPending,
    isFetching,
    current,
    nextPlace,
    isLastOfCourse,
    isLastOfDay,
    completionPlaces,
    canSkip,
    advancePending,
    sheet,
    setSheet,
    handleMove,
    handleSkip,
    handleCompletionContinue,
  } = useCourseProgress(courseId)

  const placeId =
    current?.category === 'TOUR_SPOT' ? current.spotId : current?.nearbyPlaceId

  const {
    tourSpotData,
    nearbyData,
    isPending: isPlacePending,
  } = usePlaceDetail({
    placeId: placeId ?? 0,
    category: current?.category ?? 'TOUR_SPOT',
    enabled: !!placeId,
  })
  const place = tourSpotData ?? nearbyData

  // 최초 로딩, 또는 stale 캐시로 current가 아직 없고 refetch 중이면 전체 스피너.
  // (시작 직후 진입 시 캐시가 시작 전 상태라 refetch 완료 전엔 current가 비어 있음)
  // 장소 상세(설명·지도)는 부분 스켈레톤으로 처리
  if (isPending || (!current && isFetching))
    return (
      <section className="flex flex-col h-svh items-center justify-center">
        <Spinner className="text-brand-primary size-10" />
      </section>
    )

  if (!current)
    return <Navigate to="/course/$courseId" params={{ courseId }} replace />

  return (
    <section className="flex flex-col h-svh">
      <TopBar
        leftSlot={<BackButton />}
        rightSlot={
          <div className="flex items-center gap-4">
            <PlaceBookmarkButton
              placeId={placeId ?? 0}
              category={current.category}
              isBookmarked={tourSpotData?.like ?? false}
            />
            {current.category === 'TOUR_SPOT' && (
              <Button
                onClick={() => setMemoOpen(true)}
                variant="icon"
                size="icon"
              >
                <Pencil
                  className="text-text-subdued size-4
              "
                />
              </Button>
            )}
          </div>
        }
        className="absolute top-0 left-0 w-full"
      />

      {current.img ? (
        <img src={current.img} className="w-full h-70 shrink-0 object-cover" />
      ) : (
        <div className="w-full bg-gray-300 h-70 shrink-0" />
      )}

      <div className="bg-bg-main flex-1 min-h-0 rounded-t-3xl -mt-4 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div
            className={cn(
              'px-5 pt-5 flex flex-col',
              isPlacePending && 'h-full',
            )}
          >
            <CoursePlaceHeader
              courseId={courseId}
              order={current.itemOrder}
              name={current.name}
              address={current.address}
              latitude={current.latitude}
              longitude={current.longitude}
            />

            <div className={cn('py-3', isPlacePending && 'flex-1')}>
              {isPlacePending ? (
                <div className=" flex items-center justify-center h-full">
                  <Spinner className="size-10 text-brand-primary" />
                </div>
              ) : (
                <>
                  <span className="text-body2 font-semibold mb-1 block">
                    {t('detail.description_title')}
                  </span>
                  <p className="text-label text-text-subdued">
                    {place?.overview}
                  </p>
                </>
              )}
            </div>
          </div>

          {current.category !== 'TOUR_SPOT' &&
            (isPlacePending ? (
              <div className="mx-5 min-h-57.5 animate-pulse rounded-md bg-gray-200" />
            ) : (
              nearbyData && (
                <div className="flex items-center flex-col flex-1 mx-5 border rounded-md overflow-hidden border-text-subdued/20">
                  <Map
                    center={{ lat: nearbyData.mapY, lng: nearbyData.mapX }}
                    style={{ width: '100%', minHeight: '230px' }}
                    level={5}
                  >
                    <MapMarker
                      position={{ lat: nearbyData.mapY, lng: nearbyData.mapX }}
                    />
                  </Map>
                </div>
              )
            ))}

          {tourSpotData && (
            <TourSpotContent
              spotId={tourSpotData.spotId}
              stampProgress={tourSpotData.stampProgress}
              location={{ lat: tourSpotData.mapY, lng: tourSpotData.mapX }}
            />
          )}
        </div>

        <div className="flex items-center gap-4 px-5 py-4 rounded-3xl shrink-0">
          <Button asChild className="flex-1" variant={'soft'}>
            <Link to={'/course/$courseId'} params={{ courseId }}>
              {t('button.see_all_course', { ns: 'course' })}
            </Link>
          </Button>
          <Button
            className="flex-1"
            onClick={() =>
              setSheet(isLastOfCourse || isLastOfDay ? 'completion' : 'next')
            }
          >
            {isLastOfCourse
              ? t('button.end_course', { ns: 'course' })
              : isLastOfDay
                ? t('progress.day_course_end', {
                    ns: 'course',
                    day: current?.dayNumber,
                  })
                : t('button.next_place', { ns: 'course' })}
          </Button>
        </div>
      </div>

      {sheet === 'next' && nextPlace && current && (
        <NextPlaceSheet
          isOpen
          onClose={() => setSheet(null)}
          place={nextPlace}
          origin={{ latitude: current.latitude, longitude: current.longitude }}
          onMove={handleMove}
          onSkip={handleSkip}
          disableSkip={!canSkip}
          isPending={advancePending}
        />
      )}

      {sheet === 'completion' && current && (
        <CompletionSheet
          isOpen
          onClose={() => setSheet(null)}
          variant={isLastOfCourse ? 'course' : 'day'}
          dayNumber={current.dayNumber}
          visitedPlaces={completionPlaces}
          onContinue={handleCompletionContinue}
          isPending={advancePending}
        />
      )}

      {current.category === 'TOUR_SPOT' && (
        <TourSpotMemoDialog
          spotId={current.spotId!}
          isOpen={memoOpen}
          onClose={() => setMemoOpen(false)}
        />
      )}
    </section>
  )
}
