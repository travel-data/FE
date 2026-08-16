import { getMyPage } from '@/api/my'
import { QUERY_KEY } from '@/constants/query-key'
import { useQuery } from '@tanstack/react-query'

export function useMyPageQuery() {
  return useQuery({
    queryKey: QUERY_KEY.my.page(),
    queryFn: getMyPage,
  })
}
