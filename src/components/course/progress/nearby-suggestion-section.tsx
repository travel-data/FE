import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useNearbyPlaces } from '@/hooks/queries/place'
import ImageFallback from '@/components/image-fallback'

function SuggestionCardSkeleton() {
  return (
    <div className="w-35 shrink-0">
      <div className="aspect-square w-full animate-pulse rounded-2xl bg-gray-200" />
      <div className="mt-2 h-5 w-24 animate-pulse rounded bg-gray-200" />
    </div>
  )
}

// 진행 중 관광지 주변의 식당·숙소 추천. 다음 장소가 관광지일 때만 노출된다.
function NearbySuggestionSection({
  spotId,
  courseId,
}: {
  spotId: number
  courseId: string
}) {
  const { t } = useTranslation('course')
  const { data, isPending } = useNearbyPlaces(spotId)
  const places = data?.nearbyPlaces ?? []

  if (!isPending && places.length === 0) return null

  return (
    <section className="py-4">
      <div className="mb-4">
        <h4 className="text-body2 font-semibold text-text-heading">
          {t('recommend.other_place_title')}
        </h4>
        <p className="text-label text-text-subdued">
          {t('recommend.other_place_description')}
        </p>
      </div>

      <ul className="flex gap-3 overflow-x-auto">
        {isPending
          ? Array.from({ length: 3 }).map((_, idx) => (
              <li key={idx}>
                <SuggestionCardSkeleton />
              </li>
            ))
          : places.map((place) => (
              <li key={place.nearbyPlaceId}>
                <Link
                  to="/place/$placeId"
                  params={{ placeId: String(place.nearbyPlaceId) }}
                  search={{ category: place.category, courseId }}
                  className="block w-35 shrink-0"
                >
                  <div className="relative">
                    {place.img ? (
                      <img
                        src={place.img}
                        alt={place.name}
                        className="aspect-square w-full rounded-2xl object-cover"
                      />
                    ) : (
                      <ImageFallback className="aspect-square w-full rounded-2xl" />
                    )}
                  </div>
                  <p className="mt-2 text-body2 font-bold line-clamp-1">
                    {place.name}
                  </p>
                </Link>
              </li>
            ))}
      </ul>
    </section>
  )
}

export default NearbySuggestionSection
