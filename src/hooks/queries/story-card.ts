import { getSavedStoryCards, getStoryCardDetail } from '@/api/story-card'
import { QUERY_KEY } from '@/constants/query-key'
import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query'

const SAVED_STORY_CARD_PAGE_SIZE = 20

export function useStoryCardDetailQuery(
  spotId: number,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: QUERY_KEY.storyCard.detail(spotId),
    queryFn: () => getStoryCardDetail(spotId),
    enabled: enabled && Number.isSafeInteger(spotId) && spotId > 0,
    retry: false,
  })
}

export function useStoryCardDetailsQueries(
  spotIds: number[],
  { enabled = true }: { enabled?: boolean } = {},
) {
  const uniqueSpotIds = [...new Set(spotIds)]

  return useQueries({
    queries: uniqueSpotIds.map((spotId) => ({
      queryKey: QUERY_KEY.storyCard.detail(spotId),
      queryFn: () => getStoryCardDetail(spotId),
      enabled: enabled && Number.isSafeInteger(spotId) && spotId > 0,
      retry: false,
    })),
  })
}

export function useSavedStoryCardsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: QUERY_KEY.storyCard.saved(SAVED_STORY_CARD_PAGE_SIZE),
    queryFn: ({ pageParam }) =>
      getSavedStoryCards({
        page: pageParam,
        size: SAVED_STORY_CARD_PAGE_SIZE,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })
}
