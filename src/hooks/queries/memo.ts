import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/query-key'
import { getTourSpotMemo } from '@/api/memo'

export function useTourSpotMemo(spotId: number, { enabled = true } = {}) {
  return useQuery({
    queryKey: QUERY_KEY.memo.tourSpot(spotId),
    queryFn: () => getTourSpotMemo(spotId),
    enabled,
  })
}
