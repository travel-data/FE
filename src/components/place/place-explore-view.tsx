import { useState, type ReactNode } from 'react'
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk'
import { LocateFixed } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Marker from '@/assets/icons/maker-icon.svg?react'
import SearchInput from '@/components/input/search-input'
import { useTourSpotsInfiniteQuery } from '@/hooks/queries/place'
import type { PlaceCategory, TourSpotListItem } from '@/types/place'
import { getPlaceId } from '@/types/place'
import useDebounce from '@/hooks/use-debounce'
import { getCurrentPosition, type LatLng } from '@/lib/geo'

const CATEGORY_FILTERS: {
  key: PlaceCategory | 'all'
  labelKey: 'type.all' | 'type.attraction' | 'type.restaurant' | 'type.accommodation'
}[] = [
  { key: 'all', labelKey: 'type.all' },
  { key: 'TOUR_SPOT', labelKey: 'type.attraction' },
  { key: 'RESTAURANT', labelKey: 'type.restaurant' },
  { key: 'ACCOMMODATION', labelKey: 'type.accommodation' },
]

const GYEONGJU_CENTER: LatLng = { lat: 35.8562, lng: 129.2247 }

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

function PlaceCard({
  place,
  onSelect,
}: {
  place: TourSpotListItem
  onSelect: (place: TourSpotListItem) => void
}) {
  const { t } = useTranslation('place')

  const categoryLabel: Record<PlaceCategory, string> = {
    TOUR_SPOT: t('type.attraction'),
    RESTAURANT: t('type.restaurant'),
    ACCOMMODATION: t('type.accommodation'),
  }

  return (
    <li className="flex gap-3 py-4" onClick={() => onSelect(place)}>
      {place.img ? (
        <img src={place.img} className="size-22.5 rounded-lg object-cover" />
      ) : (
        <div className="size-22.5 shrink-0 rounded-lg bg-gray-200" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-body2 font-bold text-nowrap truncate text-text-heading text-ellipsis">
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
  )
}

interface PlaceExploreViewProps {
  onSelectPlace: (place: TourSpotListItem) => void
  topLeftSlot?: ReactNode // 코스 추가 플로우의 BackButton 등. 없으면 검색창이 전체 폭
  showCurrentLocation?: boolean // 현재 위치 버튼 노출 (nav 장소 탭)
  initialCategory?: PlaceCategory
  initialKeyword?: string
}

function PlaceExploreView({
  onSelectPlace,
  topLeftSlot,
  showCurrentLocation = false,
  initialCategory,
  initialKeyword = '',
}: PlaceExploreViewProps) {
  const { t } = useTranslation('place')
  const appKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined
  const [loading, error] = useKakaoLoader({ appkey: appKey ?? '' })

  const [category, setCategory] = useState<PlaceCategory | undefined>(
    initialCategory,
  )
  const [inputValue, setInputValue] = useState(initialKeyword)
  const debouncedKeyword = useDebounce(inputValue, 300)

  const [mapCenter, setMapCenter] = useState<LatLng>(GYEONGJU_CENTER)
  const [userPos, setUserPos] = useState<LatLng | null>(null)

  const { data, isPending, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useTourSpotsInfiniteQuery({
      category,
      keyword: debouncedKeyword || undefined,
    })

  const places = data?.pages.flatMap((page) => page.places) ?? []

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

  const moveToCurrentLocation = async () => {
    try {
      const pos = await getCurrentPosition()
      setUserPos(pos)
      setMapCenter(pos)
    } catch {
      // 위치 권한 거부/실패 시 조용히 무시 (지도는 기존 중심 유지)
    }
  }

  return (
    <section className="relative h-svh">
      <div className="relative h-80 bg-gray-200">
        {!loading && !error && appKey && (
          <Map
            center={mapCenter}
            style={{ width: '100%', height: '100%' }}
            level={7}
          >
            {places.map((place) => (
              <MapMarker
                key={getPlaceId(place)}
                position={{ lat: place.latitude, lng: place.longitude }}
                title={place.name}
                onClick={() => onSelectPlace(place)}
              />
            ))}
            {userPos && <MapMarker position={userPos} />}
          </Map>
        )}
        <div className="absolute left-0 w-full p-4 top-0 z-10 flex items-center gap-4">
          {topLeftSlot}
          <SearchInput value={inputValue} onChange={setInputValue} />
        </div>

        {showCurrentLocation && (
          <button
            type="button"
            onClick={moveToCurrentLocation}
            aria-label={t('current_location')}
            className="absolute right-4 top-64 z-20 flex size-11 items-center justify-center rounded-full bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)]"
          >
            <LocateFixed className="size-5 text-brand-primary" />
          </button>
        )}
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
                onClick={() => setCategory(key === 'all' ? undefined : key)}
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

        <ul onScroll={handleScroll} className="mt-2 flex-1 overflow-y-auto px-5">
          {isPending &&
            Array.from({ length: 5 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
          {!isPending && places.length === 0 && (
            <div className="flex-1 flex items-center justify-center h-full">
              <p className="text-text-subdued text-label">{t('search.empty')}</p>
            </div>
          )}
          {places.map((place) => (
            <PlaceCard
              key={getPlaceId(place)}
              place={place}
              onSelect={onSelectPlace}
            />
          ))}

          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => <PlaceCardSkeleton key={i} />)}
        </ul>
      </div>
    </section>
  )
}

export default PlaceExploreView
