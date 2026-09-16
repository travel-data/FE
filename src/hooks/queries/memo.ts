import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/query-key'
import { getMemoList, getTourSpotMemo } from '@/api/memo'

const MEMO_PAGE_SIZE = 20

export function useTourSpotMemoQuery(
  spotId: number,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: QUERY_KEY.memo.detail(spotId),
    queryFn: () => getTourSpotMemo(spotId),
    enabled: enabled && Number.isSafeInteger(spotId) && spotId > 0,
    retry: false,
  })
}

export const useTourSpotMemo = useTourSpotMemoQuery

export function useMemoListInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: QUERY_KEY.memo.list(MEMO_PAGE_SIZE),
    queryFn: ({ pageParam }) =>
      getMemoList({ page: pageParam, size: MEMO_PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.page + 1 < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })
}
