import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/query-key'
import {
  getNearbyPlaceDetail,
  getTourSpotDetail,
  getTourSpots,
} from '@/api/place'
import type { PlaceCategory } from '@/types/place'

const PAGE_SIZE = 20

export function useTourSpotsInfiniteQuery({
  category,
  keyword,
}: {
  category?: PlaceCategory
  keyword?: string
}) {
  return useInfiniteQuery({
    queryKey: QUERY_KEY.place.tourSpots({ category, keyword }),
    queryFn: ({ pageParam }) =>
      getTourSpots({ category, keyword, page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.length * PAGE_SIZE
      return fetched < lastPage.totalCount ? allPages.length : undefined
    },
  })
}

export function useGetTourSpotDetail(spotId: number, { enabled = true } = {}) {
  return useQuery({
    queryKey: QUERY_KEY.place.tourSpot(spotId),
    queryFn: () => getTourSpotDetail(spotId),
    enabled,
  })
}

export function useGetNearbyPlaceDetail(nearbyPlaceId: number, { enabled = true } = {}) {
  return useQuery({
    queryKey: QUERY_KEY.place.nearbyPlace(nearbyPlaceId),
    queryFn: () => getNearbyPlaceDetail(nearbyPlaceId),
    enabled,
  })
}
