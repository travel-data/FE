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
    savedPlaces: () => ['place', 'savedPlaces'] as const,
    tourSpot: (spotId: number) => ['place', 'tourSpots', 'detail', spotId],
    nearbyPlace: (nearbyPlaceId: number) => [
      'place',
      'nearbyPlace',
      'detail',
      nearbyPlaceId,
    ],
    nearbyPlaces: (spotId: number) => ['place', 'nearbyPlaces', spotId] as const,
  },
  memo: {
    tourSpot: (spotId: number) => ['memo', 'tourSpot', spotId] as const,
    all: () => ['memo'] as const,
    list: (size: number) => ['memo', 'list', { size }] as const,
    detail: (spotId: number) => ['memo', 'detail', spotId] as const,
  },
  story: {
    tourSpot: (spotId: number) => ['story', 'tourSpot', spotId] as const,
    featured: () => ['story', 'featured'] as const,
  },
  course: {
    lists: () => ['tour-course', 'list'] as const,
    list: (params?: { page?: number; size?: number }) =>
      params
        ? (['tour-course', 'list', params] as const)
        : (['tour-course', 'list'] as const),
    detail: (courseId: string) => ['tour-course', 'detail', courseId],
    featured: () => ['tour-course', 'featured'] as const,
    shared: (courseId: string) => ['tour-course', 'shared', courseId] as const,
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
  storyCard: {
    all: () => ['story-card'] as const,
    detail: (spotId: number) => ['story-card', 'detail', spotId] as const,
    savedAll: () => ['story-card', 'saved'] as const,
    saved: (size: number) => ['story-card', 'saved', { size }] as const,
  },
}
