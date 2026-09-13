import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import PlaceInfo from '@/components/note/place-info'
import PlaceMemo from '@/components/note/place-memo'
import { useTourSpotMemoQuery } from '@/hooks/queries/memo'
import { useStoryCardDetailQuery } from '@/hooks/queries/story-card'
import type { PlaceCategory } from '@/types/place'
import { usePlaceDetail } from '@/hooks/queries/place'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute(
  '/(authentication)/my/travel-notes/$courseId_/place/$placeId',
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as PlaceCategory | undefined) ?? 'TOUR_SPOT',
  }),
})

const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  TOUR_SPOT: '관광지',
  RESTAURANT: '음식점',
  ACCOMMODATION: '숙소',
}

function RouteComponent() {
  const navigate = useNavigate()
  const { courseId, placeId } = Route.useParams()
  const { category } = Route.useSearch()
  const numericPlaceId = Number(placeId)
  const { tourSpotData, nearbyData, isPending, isError } = usePlaceDetail({
    placeId: numericPlaceId,
    category,
  })
  const place = tourSpotData ?? nearbyData
  const { data: memoData } = useTourSpotMemoQuery(numericPlaceId, {
    enabled: category === 'TOUR_SPOT',
  })
  const { data: storyCard } = useStoryCardDetailQuery(numericPlaceId, {
    enabled: category === 'TOUR_SPOT',
  })

  const handleBack = () => {
    navigate({
      to: '/my/travel-notes/$courseId',
      params: { courseId },
      replace: true,
    })
  }

  return (
    <div className="flex min-h-svh flex-col bg-white">
      <header className="flex items-center px-5 py-3">
        <button
          type="button"
          onClick={handleBack}
          className="flex size-11 items-center justify-center rounded-full bg-white"
        >
          <ChevronLeft className="size-[18px]" />
        </button>
      </header>

      <main className="flex-1">
        {isPending ? (
          <div className="flex min-h-80 items-center justify-center">
            <Spinner className="size-8 text-brand-primary" />
          </div>
        ) : isError || !place ? (
          <div className="flex min-h-80 items-center justify-center px-5">
            <p className="text-center text-body1 text-status-error">
              장소 상세정보를 불러오지 못했습니다.
            </p>
          </div>
        ) : (
          <>
            <PlaceInfo
              category={CATEGORY_LABEL[category]}
              placeName={place.name}
              address={place.address}
              description={place.overview || '장소 설명이 없습니다.'}
              hasStoryCard={Boolean(storyCard)}
              storyCardImageUrl={storyCard?.imageUrl}
              onStoryCardClick={
                storyCard
                  ? () =>
                      navigate({
                        to: '/storycards/$spotId',
                        params: { spotId: String(storyCard.spotId) },
                      })
                  : undefined
              }
            />

            <div className="h-8" />

            {category === 'TOUR_SPOT' ? (
              <PlaceMemo
                courseId={courseId}
                placeId={placeId}
                memo={
                  memoData?.memo
                    ? {
                        content: memoData.memo.content,
                        images: memoData.memo.imageUrl
                          ? [memoData.memo.imageUrl]
                          : [],
                      }
                    : undefined
                }
                editScope="my-travel-notes"
              />
            ) : null}
          </>
        )}
      </main>
    </div>
  )
}
