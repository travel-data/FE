import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Trans, useTranslation } from 'react-i18next'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import BackButton from '@/components/button/back-button'
import TopBar from '@/components/layout/top-bar'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import PlaceBookmarkButton from '@/components/place/place-bookmark-button'
import PlaceDirectionsButton from '@/components/place/place-directions-button'
import MarkerIcon from '@/assets/icons/maker-icon.svg?react'
import { usePlaceDetail } from '@/hooks/queries/place'
import { useGetCourseDetail } from '@/hooks/queries/course'
import { useUpdateCourse, useAdvanceCourse } from '@/hooks/mutations/course'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'
import { insertNearbyAfterCurrent } from '@/mappers/course'
import type { NearbyPlaceCategory, PlaceCategory } from '@/types/place'

type PlaceSearch = { category: PlaceCategory; courseId?: string }

export const Route = createFileRoute('/(authentication)/place/$placeId')({
  validateSearch: (search: Record<string, unknown>): PlaceSearch => ({
    category: search.category as PlaceCategory,
    courseId: typeof search.courseId === 'string' ? search.courseId : undefined,
  }),
  component: RouteComponent,
})

const CATEGORY_LABEL_KEY = {
  TOUR_SPOT: 'type.attraction',
  RESTAURANT: 'type.restaurant',
  ACCOMMODATION: 'type.accommodation',
} as const satisfies Record<PlaceCategory, string>

function RouteComponent() {
  const { t } = useTranslation('place')
  const { placeId } = Route.useParams()
  const { category, courseId } = Route.useSearch()
  const navigate = useNavigate()

  useKakaoLoader({ appkey: import.meta.env.VITE_KAKAO_JS_KEY ?? '' })

  const id = Number(placeId)
  const { isTourSpot, tourSpotData, nearbyData, isPending } = usePlaceDetail({
    placeId: id,
    category,
  })
  const place = tourSpotData ?? nearbyData

  const openConfirm = useConfirmModalStore((s) => s.open)
  const { data: courseDetail } = useGetCourseDetail(courseId ?? '')
  const { mutateAsync: updateCourse } = useUpdateCourse()
  const { mutateAsync: advance } = useAdvanceCourse()

  if (isPending || !place)
    return (
      <div className=" flex items-center justify-center h-full">
        <Spinner className="size-10 text-brand-primary" />
      </div>
    )

  // 진행 중 코스가 있고, 관광지가 아닐 때(주변 장소)만 방문하기 노출
  const canVisit = !!courseId && !isTourSpot

  const handleVisit = () => {
    openConfirm({
      title: t('confirm.add_course_place_title', { ns: 'course' }),
      description: (
        <Trans i18nKey="confirm.add_break_place_description" ns="course" />
      ),
      actionLabel: t('action.visit'),
      onAction: async () => {
        const current = courseDetail?.items.find(
          (i) => i.status === 'IN_PROGRESS',
        )
        if (!courseDetail || !current || !courseId) return

        // 현재 장소 다음에 주변 장소 삽입
        const updated = await updateCourse({
          courseId,
          body: insertNearbyAfterCurrent(courseDetail, {
            nearbyPlaceId: id,
            category: category as NearbyPlaceCategory,
          }),
        })
        // 삽입된 아이템 = 현재 장소 바로 다음 순서
        const currentAfter = updated.items.find(
          (i) => i.itemId === current.itemId,
        )
        const inserted = updated.items.find(
          (i) =>
            currentAfter != null &&
            i.dayNumber === currentAfter.dayNumber &&
            i.itemOrder === currentAfter.itemOrder + 1,
        )
        if (!inserted) return

        // 현재 장소 완료 + 삽입한 장소를 진행 중으로 → progress에서 바로 표시
        await advance({
          courseId,
          complete: [current.itemId],
          start: inserted.itemId,
        })
        navigate({
          to: '/course/$courseId/progress',
          params: { courseId },
          replace: true,
        })
      },
    })
  }

  return (
    <section className="flex h-svh flex-col">
      <div className="flex-1 overflow-y-auto">
        <TopBar
          leftSlot={<BackButton />}
          rightSlot={
            <PlaceBookmarkButton
              placeId={id}
              category={category}
              isBookmarked={place?.like ?? false}
            />
          }
        />

        <div className="px-4">
          {place.img ? (
            <img
              src={place.img}
              alt={place.name}
              className="h-56 w-full object-cover rounded-lg"
            />
          ) : (
            <div className="h-56 w-full bg-gray-200 rounded-lg" />
          )}
        </div>

        <div className="px-5 pt-4">
          <p className="text-label font-semibold text-brand-primary">
            {t(CATEGORY_LABEL_KEY[category])}
          </p>
          <h2 className="text-title3 text-text-heading">{place.name}</h2>
          <p className="flex items-center gap-1 mt-1 text-label text-text-subdued">
            <MarkerIcon className="size-3" />
            {place.address}
          </p>
          <div className="py-3">
            <span className="text-body2 font-semibold mb-1 block">
              {t('detail.description_title')}
            </span>
            <p className="text-label text-text-subdued">{place?.overview}</p>
          </div>
          <div className="h-56 overflow-hidden rounded-lg border border-text-subdued/20">
            <Map
              center={{ lat: place.mapY, lng: place.mapX }}
              style={{ width: '100%', height: '100%' }}
              level={4}
            >
              <MapMarker position={{ lat: place.mapY, lng: place.mapX }} />
            </Map>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4 px-5 py-4">
        <PlaceDirectionsButton latitude={place.mapY} longitude={place.mapX} />
        {canVisit && (
          <Button className="flex-1" onClick={handleVisit}>
            {t('action.visit')}
          </Button>
        )}
      </div>
    </section>
  )
}
