import {
  deleteSavedNearbyPlace,
  deleteSavedTourSpot,
} from '@/api/tour-spot'
import TopBar from '@/components/layout/top-bar'
import ImageFallback from '@/components/image-fallback'
import { QUERY_KEY } from '@/constants/query-key'
import { useSavedPlacesQuery } from '@/hooks/queries/place'
import { usePlaceDetailSheetStore } from '@/stores/place-detail-sheet-store'
import type { SavedPlaceListItem } from '@/types/place'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { ChevronLeft, Trash2 } from 'lucide-react'

export const Route = createFileRoute('/(authentication)/my/saved-places')({
  component: RouteComponent,
})

const CATEGORY_LABEL = {
  TOUR_SPOT: '관광지',
  RESTAURANT: '음식점',
  ACCOMMODATION: '숙소',
} as const

function getSavedPlaceKey(place: SavedPlaceListItem) {
  return place.category === 'TOUR_SPOT'
    ? `spot-${place.spotId}`
    : `nearby-${place.nearbyPlaceId}`
}

function RouteComponent() {
  const router = useRouter()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data, isLoading } = useSavedPlacesQuery()
  const openPlaceDetail = usePlaceDetailSheetStore((state) => state.open)
  const savedPlaces = data?.items ?? []

  const deleteMutation = useMutation({
    mutationFn: async (place: SavedPlaceListItem) => {
      if (place.category === 'TOUR_SPOT') {
        await deleteSavedTourSpot(place.spotId)
        return
      }

      await deleteSavedNearbyPlace(place.nearbyPlaceId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.place.savedPlaces() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.my.page() })
    },
  })

  const handleBack = () => {
    if (router.history.canGoBack()) {
      router.history.back()
      return
    }

    navigate({ to: '/my' })
  }

  return (
    <div className="relative flex h-svh flex-col bg-white">
      <TopBar
        title="저장한 장소"
        leftSlot={
          <button
            type="button"
            aria-label="뒤로가기"
            onClick={handleBack}
            className="flex size-8 items-center justify-center rounded-full text-text-heading"
          >
            <ChevronLeft className="size-6" />
          </button>
        }
      />

      <main className="mt-2 flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-24">
        {!isLoading && savedPlaces.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-body1 text-text-default">
              저장한 장소가 없습니다
            </p>
          </div>
        ) : null}

        {savedPlaces.map((place) => (
          <article
            role="button"
            tabIndex={0}
            key={getSavedPlaceKey(place)}
            onClick={() =>
              openPlaceDetail(
                place.category === 'TOUR_SPOT'
                  ? place.spotId
                  : place.nearbyPlaceId,
                place.category,
              )
            }
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return
              openPlaceDetail(
                place.category === 'TOUR_SPOT'
                  ? place.spotId
                  : place.nearbyPlaceId,
                place.category,
              )
            }}
            className="flex items-center rounded-[8px] bg-primary-50 p-3 text-left"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="min-w-0 truncate text-title3 font-medium text-text-heading">
                  {place.name}
                </h2>
                <span className="shrink-0 rounded-[40px] bg-brand-primary px-3 py-1 text-caption text-primary-50">
                  {CATEGORY_LABEL[place.category]}
                </span>
              </div>

              <p className="mt-2 min-w-0 truncate text-caption text-text-subdued">
                {place.address}
              </p>
            </div>

            <div className="ml-3 size-[72px] shrink-0 overflow-hidden rounded-[8px] bg-white">
              {place.imageUrl || place.img ? (
                <img
                  src={place.imageUrl ?? place.img}
                  alt={place.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageFallback className="h-full w-full" />
              )}
            </div>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                deleteMutation.mutate(place)
              }}
              aria-label="삭제"
              disabled={deleteMutation.isPending}
              className="ml-5 flex size-6 shrink-0 items-center justify-center text-text-subdued disabled:opacity-40"
            >
              <Trash2 className="size-6" />
            </button>
          </article>
        ))}
      </main>
    </div>
  )
}
