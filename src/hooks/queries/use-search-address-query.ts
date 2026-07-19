import { QUERY_KEY } from '@/constants/query-key'
import { getSearchAddress } from '@/services/kakao/local'
import { useInfiniteQuery } from '@tanstack/react-query'
import useDebounce from '../use-debounce'

function useSearchAddressQuery(searchTerm: string) {
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return useInfiniteQuery({
    queryKey: QUERY_KEY.search.searchAddress(debouncedSearchTerm),
    queryFn: ({ pageParam }) =>
      getSearchAddress({ query: searchTerm, page: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.meta.is_end ? undefined : allPages.length + 1,
    initialPageParam: 1,
    enabled: !!searchTerm,
  })
}

export default useSearchAddressQuery
