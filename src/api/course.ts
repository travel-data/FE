import { apiClient } from '@/lib/api-client'
import {
  CourseDetail,
  CourseRequest,
  CreateCourseResponse,
} from '@/types/course'
import { CommonResponse } from '@/types/response'

export const createCourse = async (courseInfo: CourseRequest) => {
  const res = await apiClient.post<CommonResponse<CreateCourseResponse>>(
    '/api/v1/tour-courses',
    courseInfo,
  )

  return res.data.data
}

export const getCourseDetail = async (courseId: string) => {
  const res = await apiClient.get<CommonResponse<CourseDetail>>(
    `/api/v1/tour-courses/${courseId}`,
  )

  return res.data.data
}

export const updateCourseDetail = async ({
  courseId,
  body,
}: {
  courseId: string
  body: CourseRequest
}) => {
  const res = await apiClient.put<CommonResponse<CourseDetail>>(
    `/api/v1/tour-courses/${courseId}`,
    body,
  )

  return res.data.data
}
