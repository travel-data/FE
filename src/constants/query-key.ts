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
  memo: {
    tourSpot: (spotId: number) => ['memo', 'tourSpot', spotId] as const,
  },
  story: {
    tourSpot: (spotId: number) => ['story', 'tourSpot', spotId] as const,
  },
  course: {
    lists: () => ['tour-course', 'list'] as const,
    list: (params?: { page?: number; size?: number }) =>
      params
        ? (['tour-course', 'list', params] as const)
        : (['tour-course', 'list'] as const),
    detail: (courseId: string) => ['tour-course', 'detail', courseId],
  },
  my: {
    page: () => ['my', 'page'] as const,
  },
  route: {
    calculate: (params: {
      origin: { latitude: number; longitude: number }
      destination: { latitude: number; longitude: number }
      transportType: string
    }) => ['route', 'calculate', params] as const,
  },
}
