import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/query-key'
import { getTourSpotStoryCard } from '@/api/story'

export function useTourSpotStoryCard(spotId: number, { enabled = true } = {}) {
  return useQuery({
    queryKey: QUERY_KEY.story.tourSpot(spotId),
    queryFn: () => getTourSpotStoryCard(spotId),
    enabled,
    retry: false, // 스토리카드 없는 관광지는 404 → 재시도 불필요
  })
}
