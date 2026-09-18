import {
  deleteNearbyPlaceMemo,
  deleteTourSpotMemo,
  saveNearbyPlaceMemo,
  saveTourSpotMemo,
} from '@/api/memo'
import { QUERY_KEY } from '@/constants/query-key'
import type { TourSpotMemoRequest } from '@/types/memo'
import type { PlaceCategory } from '@/types/place'
import { useMutation, useQueryClient } from '@tanstack/react-query'

function useInvalidateMemoQueries() {
  const queryClient = useQueryClient()

  return (spotId: number) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY.memo.all() })
    queryClient.invalidateQueries({
      queryKey: QUERY_KEY.memo.detail(spotId),
    })
    queryClient.invalidateQueries({ queryKey: QUERY_KEY.my.page() })
  }
}

export const useSaveTourSpotMemo = () => {
  const invalidateMemoQueries = useInvalidateMemoQueries()

  return useMutation({
    mutationFn: saveTourSpotMemo,
    onSuccess: (_, { spotId }) => invalidateMemoQueries(spotId),
  })
}

export const useDeleteTourSpotMemo = () => {
  const invalidateMemoQueries = useInvalidateMemoQueries()

  return useMutation({
    mutationFn: deleteTourSpotMemo,
    onSuccess: (_, spotId) => invalidateMemoQueries(spotId),
  })
}

interface PlaceMemoVariables {
  placeId: number
  category: PlaceCategory
}

export const useSavePlaceMemo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      placeId,
      category,
      body,
    }: PlaceMemoVariables & { body: TourSpotMemoRequest }) => {
      if (category === 'TOUR_SPOT') {
        await saveTourSpotMemo({ spotId: placeId, body })
      } else {
        await saveNearbyPlaceMemo({ nearbyPlaceId: placeId, body })
      }
    },
    onSuccess: (_, { placeId, category }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.memo.all() })
      queryClient.invalidateQueries({
        queryKey:
          category === 'TOUR_SPOT'
            ? QUERY_KEY.memo.detail(placeId)
            : QUERY_KEY.memo.nearbyDetail(placeId),
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.my.page() })
    },
  })
}

export const useDeletePlaceMemo = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ placeId, category }: PlaceMemoVariables) =>
      category === 'TOUR_SPOT'
        ? deleteTourSpotMemo(placeId)
        : deleteNearbyPlaceMemo(placeId),
    onSuccess: (_, { placeId, category }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.memo.all() })
      queryClient.invalidateQueries({
        queryKey:
          category === 'TOUR_SPOT'
            ? QUERY_KEY.memo.detail(placeId)
            : QUERY_KEY.memo.nearbyDetail(placeId),
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.my.page() })
    },
  })
}
