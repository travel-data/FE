import { getCourseDetail, getMycourses } from '@/api/course'
import { QUERY_KEY } from '@/constants/query-key'
import { useQuery } from '@tanstack/react-query'

export function useGetCourseDetail(courseId: string) {
  return useQuery({
    queryKey: QUERY_KEY.course.detail(courseId),
    queryFn: () => getCourseDetail(courseId),
  })
}

export function useGetMyCourses({
  size,
  page,
}: {
  size?: number
  page?: number
}) {
  return useQuery({
    queryKey: QUERY_KEY.course.list({ page, size }),
    queryFn: () => getMycourses({ size, page }),
  })
}

const COURSE_SCAN_SIZE = 100

export function useInProgressCourse() {
  return useQuery({
    queryKey: QUERY_KEY.course.list({ size: COURSE_SCAN_SIZE }),
    queryFn: () => getMycourses({ size: COURSE_SCAN_SIZE }),
    select: (data) =>
      data.tourCourses.find((c) => c.status === 'IN_PROGRESS') ?? null,
  })
}

export function usePendingCourse() {
  return useQuery({
    queryKey: QUERY_KEY.course.list({ size: COURSE_SCAN_SIZE }),
    queryFn: () => getMycourses({ size: COURSE_SCAN_SIZE }),
    select: (data) =>
      data.tourCourses.find((c) => c.status === 'PENDING') ?? null,
  })
}
