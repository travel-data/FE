import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/query-key'
import { getFestivalDetail, getFestivals } from '@/api/festival'

export function useFestivalsQuery() {
  return useQuery({
    queryKey: QUERY_KEY.festival.list(),
    queryFn: getFestivals,
  })
}

export function useFestivalDetailQuery(spotId: number) {
  return useQuery({
    queryKey: QUERY_KEY.festival.detail(spotId),
    queryFn: () => getFestivalDetail(spotId),
    enabled: !!spotId,
  })
}
