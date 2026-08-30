import { getCourseDetail } from '@/api/course'
import { QUERY_KEY } from '@/constants/query-key'
import { useQuery } from '@tanstack/react-query'

export function useGetCourseDetail(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEY.course.detail(courseId),
    queryFn: () => getCourseDetail(courseId),
  })
}
