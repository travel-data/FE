import { createCourse, updateCourseDetail } from '@/api/course'
import { QUERY_KEY } from '@/constants/query-key'
import { queryClient } from '@/lib/query-client'
import { useMutation } from '@tanstack/react-query'

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: createCourse,
  })
}

export const useUpdateCourse = () => {
  return useMutation({
    mutationFn: updateCourseDetail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.course.detail(data.tourCourseId.toString()),
      })
    },
  })
}
