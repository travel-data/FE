import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import BackButton from '@/components/button/back-button'
import Marker from '@/assets/icons/maker-icon.svg?react'
import { useTranslation } from 'react-i18next'
import SearchInput from '@/components/input/search-input'
import { useTourSpotsInfiniteQuery } from '@/hooks/queries/place'
import type { PlaceCategory, TourSpotListItem } from '@/types/place'
import { getPlaceId } from '@/types/place'
import { useEffect, useState } from 'react'
import useDebounce from '@/hooks/use-debounce'
import { useCourseFormActions } from '@/stores/course-form-store'
import { toPlaceItem } from '@/types/course'
import { usePlaceDetailSheetStore } from '@/stores/place-detail-sheet-store'
import { useConfirmModalStore } from '@/stores/confirm-modal-store'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(authentication)/course/place-search')({
  validateSearch: (search: Record<string, unknown>) => ({
    day: Number(search.day ?? 1),
    courseId: search.courseId as string | undefined,
    category: search.category as PlaceCategory | undefined,
    keyword: (search.keyword as string | undefined) ?? '',
  }),
  component: RouteComponent,
})

const CATEGORY_FILTERS: { key: PlaceCategory | 'all'; labelKey: 'type.all' | 'type.attraction' | 'type.restaurant' | 'type.accommodation' }[] = [
  { key: 'all', labelKey: 'type.all' },
  { key: 'TOUR_SPOT', labelKey: 'type.attraction' },
  { key: 'RESTAURANT', labelKey: 'type.restaurant' },
  { key: 'ACCOMMODATION', labelKey: 'type.accommodation' },
]

const GYEONGJU_CENTER = { lat: 35.8562, lng: 129.2247 }

function PlaceCardSkeleton() {
  return (
    <li className="flex gap-3 py-4 animate-pulse items-center">
      <div className="size-22.5 shrink-0 rounded-lg bg-gray-200" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
        <div className="mt-2 h-4 w-36 rounded bg-gray-200" />
        <div className="mt-2 h-10 w-full rounded bg-gray-200"></div>
      </div>
    </li>
  )
}

function useAddPlaceFlow() {
  const { addPlace } = useCourseFormActions()
  const { open: openPlaceDetail, close: closePlaceDetail } = usePlaceDetailSheetStore()
  const openConfirm = useConfirmModalStore((s) => s.open)
  const { t } = useTranslation(['course', 'common', 'place'])
  const router = useRouter()

  return (place: TourSpotListItem) =>
    openPlaceDetail(
      getPlaceId(place),
      place.category,
      <Button
        className="w-full flex-1"
        onClick={() => {
          closePlaceDetail()
          openConfirm({
            title: t('confirm.add_course_place_title', { ns: 'course' }),
            description: t('confirm.add_course_place_description', { ns: 'course' }),
            cancelLabel: t('button.cancel', { ns: 'common' }),
            actionLabel: t('form.add_place_button', { ns: 'course' }),
            onAction: () => { addPlace(toPlaceItem(place)); router.history.back() },
          })
        }}
      >
        {t('action.add', { ns: 'place' })}
      </Button>,
    )
}

function PlaceCard({ place, onSelect }: { place: TourSpotListItem; onSelect: (place: TourSpotListItem) => void }) {
  const { t } = useTranslation('place')

  const categoryLabel: Record<PlaceCategory, string> = {
    TOUR_SPOT: t('type.attraction'),
    RESTAURANT: t('type.restaurant'),
    ACCOMMODATION: t('type.accommodation'),
  }

  return (
    <>
      <li
        className="flex gap-3 py-4"
        onClick={() => onSelect(place)}
      >
        {place.img ? (
          <img src={place.img} className="size-22.5 rounded-lg object-cover" />
        ) : (
          <div className="size-22.5 shrink-0 rounded-lg bg-gray-200" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-body2 font-bold text-nowrap truncate text-text-heading text-ellipsis ">
              {place.name}
            </span>
            <span className="shrink-0 rounded-full bg-brand-primary px-2 py-0.5 text-caption font-semibold text-white">
              {categoryLabel[place.category]}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-label text-text-subdued">
            <Marker className="size-3 shrink-0" />
            <span className="truncate">{place.address}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-wrap text-label text-text-subdued">
            {place.overview}
          </p>
        </div>
      </li>

    </>
  )
}

function RouteComponent() {
  const { t } = useTranslation('place')
  const openAddPlace = useAddPlaceFlow()
  const navigate = useNavigate({ from: Route.fullPath })
  const { category, keyword } = Route.useSearch()
  const appKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined

  const [loading, error] = useKakaoLoader({ appkey: appKey ?? '' })

  const [inputValue, setInputValue] = useState(keyword)
  const debouncedKeyword = useDebounce(inputValue, 300)

  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, keyword: debouncedKeyword }),
      replace: true,
    })
  }, [debouncedKeyword])

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useTourSpotsInfiniteQuery({
      category,
      keyword: debouncedKeyword || undefined,
    })

  const handleScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (
      scrollHeight - scrollTop - clientHeight < 100 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }

  const places = data?.pages.flatMap((page) => page.places) ?? []

  const setCategory = (key: PlaceCategory | 'all') =>
    navigate({
      search: (prev) => ({
        ...prev,
        category: key === 'all' ? undefined : key,
      }),
      replace: true,
    })

  return (
    <section className="relative h-svh">
      <div className="relative h-80 bg-gray-200">
        {!loading && !error && appKey && (
          <Map
            center={GYEONGJU_CENTER}
            style={{ width: '100%', height: '100%' }}
            level={7}
          >
            {places.map((place) => (
              <MapMarker
                key={getPlaceId(place)}
                position={{ lat: place.latitude, lng: place.longitude }}
                title={place.name}
                onClick={() => openAddPlace(place)}
              />
            ))}
          </Map>
        )}
        <div className="absolute left-0 w-full p-4 top-0 z-10 flex items-center gap-4">
          <BackButton />
          <SearchInput value={inputValue} onChange={setInputValue} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-74 z-10 flex flex-col overflow-hidden rounded-t-[28px] bg-bg-main">
        <div className="shrink-0 px-5 pt-7">
          <h2 className="text-title3 font-bold text-text-heading">
            {t('search.list_title')}
          </h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_FILTERS.map(({ key, labelKey }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-label font-semibold transition-colors ${
                  (category ?? 'all') === key
                    ? 'bg-brand-primary text-white'
                    : 'bg-primary-100 text-brand-primary'
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>

        <ul
          onScroll={handleScroll}
          className="mt-2 flex-1 overflow-y-auto px-5"
        >
          {isPending &&
            Array.from({ length: 5 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          {!isPending && places.length === 0 && (
            <div className="flex-1 flex items-center justify-center h-full">
              <p className="text-text-subdued text-label">{t('search.empty')}</p>
            </div>
          )}
          {places.map((place) => (
            <PlaceCard key={getPlaceId(place)} place={place} onSelect={openAddPlace} />
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
        </ul>
      </div>
    </section>
  )
}
