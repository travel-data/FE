import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk'
import { Phone, Clock } from 'lucide-react'
import BackButton from '@/components/button/back-button'
import Marker from '@/assets/icons/maker-icon.svg?react'
import { useTranslation } from 'react-i18next'
import PlaceDetailSheet from '@/components/place/place-detail-sheet'

export const Route = createFileRoute(
  '/(authentication)/course/$courseId_/place-search',
)({
  validateSearch: (search: Record<string, unknown>) => ({
    day: Number(search.day ?? 1),
  }),
  component: RouteComponent,
})

type AttractionCategory = 'attraction'
type BusinessCategory = 'cafe' | 'restaurant' | 'convenience'
type PlaceCategory = AttractionCategory | BusinessCategory

interface BasePlace {
  id: number
  name: string
  category: PlaceCategory
  address: string
}

interface AttractionPlace extends BasePlace {
  category: AttractionCategory
  description: string
  phone?: never
  hours?: never
}

interface BusinessPlace extends BasePlace {
  category: BusinessCategory
  description?: never
  phone?: string
  hours?: string
}

type SearchPlace = AttractionPlace | BusinessPlace

const MOCK_PLACES: SearchPlace[] = [
  {
    id: 1,
    name: '첨성대',
    category: 'attraction',
    address: '경북 경주시 첨성로 169-5',
    description:
      '신라 선덕여왕 때 세워진 동양 최초의 천문대로, 경주를 대표하는 랜드마크',
  },
  {
    id: 2,
    name: '카페 아래헌',
    category: 'cafe',
    address: '경북 경주시 보불로 181',
    phone: '0507-1234-1234',
    hours: '10:00 - 23:00',
  },
  {
    id: 3,
    name: '한다솔 경주점',
    category: 'restaurant',
    address: '경북 경주시 보불로 181',
    phone: '0507-1234-1234',
    hours: '10:00 - 23:00',
  },
  {
    id: 4,
    name: '한다솔 경주점',
    category: 'restaurant',
    address: '경북 경주시 보불로 181',
    phone: '0507-1234-1234',
    hours: '10:00 - 23:00',
  },
  {
    id: 5,
    name: '카페 아래헌',
    category: 'cafe',
    address: '경북 경주시 보불로 181',
    phone: '0507-1234-1234',
    hours: '10:00 - 23:00',
  },
  {
    id: 6,
    name: '첨성대',
    category: 'attraction',
    address: '경북 경주시 첨성로 169-5',
    description:
      '신라 선덕여왕 때 세워진 동양 최초의 천문대로, 경주를 대표하는 랜드마크',
  },
]

const CATEGORY_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'attraction', label: '관광' },
  { key: 'cafe', label: '카페' },
  { key: 'restaurant', label: '음식점' },
  { key: 'convenience', label: '편의' },
] as const

const GYEONGJU_CENTER = { lat: 35.8562, lng: 129.2247 }

function PlaceCard({ place }: { place: SearchPlace }) {
  const [placeSheetOpen, setPlaceSheetOpen] = useState(false)

  const { t } = useTranslation('place')

  const categoryLabel: Record<PlaceCategory, string> = {
    attraction: t('type.attraction'),
    cafe: t('type.cafe'),
    restaurant: t('type.restaurant'),
    convenience: '편의',
  }

  return (
    <>
      <li className="flex gap-3 py-4" onClick={() => setPlaceSheetOpen(true)}>
        <div className="size-22.5 shrink-0 rounded-lg bg-gray-200" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-body1 font-bold text-text-heading">
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

          {place.category === 'attraction' ? (
            <p className="mt-0.5 truncate text-label text-text-subdued line-clamp-2 text-wrap">
              {place.description}
            </p>
          ) : (
            <>
              {place.phone && (
                <div className="mt-0.5 flex items-center gap-1 text-label text-text-subdued">
                  <Phone className="size-3 shrink-0" />
                  <span>{place.phone}</span>
                </div>
              )}
              {place.hours && (
                <div className="mt-0.5 flex items-center gap-1 text-label text-text-subdued">
                  <Clock className="size-3 shrink-0" />
                  <span>
                    {t('business_hours')} · {place.hours}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </li>

      {placeSheetOpen && (
        <PlaceDetailSheet
          isOpen={placeSheetOpen}
          onClose={() => setPlaceSheetOpen(false)}
          placeId={place.id}
        />
      )}
    </>
  )
}

function RouteComponent() {
  const { t } = useTranslation('place')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const appKey = import.meta.env.VITE_KAKAO_JS_KEY as string | undefined
  const [loading, error] = useKakaoLoader({ appkey: appKey ?? '' })

  const filteredPlaces =
    selectedCategory === 'all'
      ? MOCK_PLACES
      : MOCK_PLACES.filter((p) => p.category === selectedCategory)

  return (
    <section className="relative h-svh">
      <div className="relative h-80 bg-gray-200">
        {!loading && !error && appKey && (
          <Map
            center={GYEONGJU_CENTER}
            style={{ width: '100%', height: '100%' }}
            level={5}
          />
        )}
        <div className="absolute left-4 top-4 z-10">
          <BackButton />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-74 z-10 flex flex-col overflow-hidden rounded-t-[28px] bg-bg-main">
        <div className="shrink-0 px-5 pt-7">
          <h2 className="text-title2 font-bold text-text-heading">
            {t('search.list_title')}
          </h2>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-label font-semibold transition-colors ${
                  selectedCategory === key
                    ? 'bg-brand-primary text-white'
                    : 'bg-primary-100 text-brand-primary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-2 flex-1 overflow-y-auto px-5">
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </ul>
      </div>
    </section>
  )
}
