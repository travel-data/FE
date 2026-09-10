import { useMutation } from '@tanstack/react-query'
import { deleteTourSpotMemo, saveTourSpotMemo } from '@/api/memo'
import { QUERY_KEY } from '@/constants/query-key'
import { queryClient } from '@/lib/query-client'

export const useSaveTourSpotMemo = () => {
  return useMutation({
    mutationFn: saveTourSpotMemo,
    onSuccess: (_, { spotId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.memo.tourSpot(spotId),
      })
    },
  })
}

export const useDeleteTourSpotMemo = () => {
  return useMutation({
    mutationFn: deleteTourSpotMemo,
    onSuccess: (_, spotId) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.memo.tourSpot(spotId),
      })
    },
  })
}
