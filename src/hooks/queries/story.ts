import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/query-key'
import { getFeaturedStoryCards, getTourSpotStoryCard } from '@/api/story'

export function useTourSpotStoryCard(spotId: number, { enabled = true } = {}) {
  return useQuery({
    queryKey: QUERY_KEY.story.tourSpot(spotId),
    queryFn: () => getTourSpotStoryCard(spotId),
    enabled,
    retry: false, // 스토리카드 없는 관광지는 404 → 재시도 불필요
  })
}

// 오늘의 스토리카드 1개
export function useFeaturedStoryCard() {
  return useQuery({
    queryKey: QUERY_KEY.story.featured(),
    queryFn: () => getFeaturedStoryCards(1),
    select: (data) => data[0] ?? null,
  })
}
