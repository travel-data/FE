import {
  getCourseDetail,
  getCourseList,
  getFeaturedCourses,
  getMycourses,
} from '@/api/course'
import { QUERY_KEY } from '@/constants/query-key'
import { useQuery } from '@tanstack/react-query'

export function useGetCourseDetail(courseId: string, { enabled = true } = {}) {
  return useQuery({
    queryKey: QUERY_KEY.course.detail(courseId),
    queryFn: () => getCourseDetail(courseId),
    enabled: enabled && !!courseId,
  })
}

export function useFeaturedCourses(size?: number) {
  return useQuery({
    queryKey: [...QUERY_KEY.course.featured(), size],
    queryFn: () => getFeaturedCourses(size),
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

export function useInProgressCourse({ enabled = true } = {}) {
  return useQuery({
    queryKey: QUERY_KEY.course.list({ size: COURSE_SCAN_SIZE }),
    queryFn: () => getMycourses({ size: COURSE_SCAN_SIZE }),
    enabled,
    select: (data) =>
      data.tourCourses.find((c) => c.status === 'IN_PROGRESS') ?? null,
  })
}

export function usePendingCourse({ enabled = true } = {}) {
  return useQuery({
    queryKey: QUERY_KEY.course.list({ size: COURSE_SCAN_SIZE }),
    queryFn: () => getMycourses({ size: COURSE_SCAN_SIZE }),
    enabled,
    select: (data) =>
      data.tourCourses.find((c) => c.status === 'PENDING') ?? null,
  })
}

export function useGetCourseList() {
  return useQuery({
    queryKey: QUERY_KEY.course.list(),
    queryFn: getCourseList,
  })
}
