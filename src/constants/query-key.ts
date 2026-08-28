import type { PlaceCategory } from '@/types/place'

export const QUERY_KEY = {
  search: {
    searchAddress: (searchTerm: string) =>
      ['search', 'address', searchTerm] as const,
  },
  festival: {
    list: () => ['festival', 'list'] as const,
    detail: (spotId: number) => ['festival', 'detail', spotId] as const,
  },
  place: {
    tourSpots: (params: { category?: PlaceCategory; keyword?: string }) =>
      ['place', 'tourSpots', params] as const,
    tourSpot: (spotId: number) => ['place', 'tourSpots', 'detail', spotId],
    nearbyPlace: (nearbyPlaceId: number) => [
      'place',
      'nearbyPlace',
      'detail',
      nearbyPlaceId,
    ],
  },
  course: {
    detail: (courseId: string) => ['tour-course', 'detail', courseId],
  },
  my: {
    page: () => ['my', 'page'] as const,
  },
}
