import {
  advanceCourse,
  createCourse,
  patchCourseStatus,
  updateCourseDetail,
} from '@/api/course'
import { QUERY_KEY } from '@/constants/query-key'
import { queryClient } from '@/lib/query-client'
import { useMutation } from '@tanstack/react-query'

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.course.lists(),
      })
    },
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

export const useUpdateCourseStatus = () => {
  return useMutation({
    mutationFn: patchCourseStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.course.detail(data.tourCourseId.toString()),
      })
      // 상태 변경 → 메인 진행중/대기 카드도 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.course.lists() })
    },
  })
}

// 여행 시작/다음 장소 이동/건너뛰기/코스 그만하기 공통
export const useAdvanceCourse = () => {
  return useMutation({
    mutationFn: advanceCourse,
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.course.detail(courseId),
      })
      // 코스 status가 아이템에서 파생 → 메인 진행중/대기 카드도 갱신
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.course.lists() })
    },
  })
}
