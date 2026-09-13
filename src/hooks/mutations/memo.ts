import { deleteTourSpotMemo, saveTourSpotMemo } from '@/api/memo'
import { QUERY_KEY } from '@/constants/query-key'
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
