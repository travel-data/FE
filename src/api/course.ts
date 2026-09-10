import { apiClient } from '@/lib/api-client'
import {
  CourseDetail,
  CourseListDetail,
  CourseRequest,
  CourseStatus,
  CreateCourseResponse,
} from '@/types/course'
import { CommonResponse, Paginated } from '@/types/response'

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

export const patchCourseItemStatus = async (
  courseId: string,
  itemId: number,
  status: CourseStatus,
) => {
  await apiClient.patch(`/api/v1/tour-courses/${courseId}/items/${itemId}`, {
    status,
  })
}

export const patchCourseStatus = async ({
  courseId,
  status,
}: {
  courseId: string
  status: CourseStatus
}) => {
  const res = await apiClient.patch<CommonResponse<CourseDetail>>(
    `/api/v1/tour-courses/${courseId}/status`,
    { status },
  )

  return res.data.data
}

export const advanceCourse = async ({
  courseId,
  complete,
  start,
}: {
  courseId: string
  complete: number[]
  start: number | null
}) => {
  await Promise.all([
    ...complete.map((id) => patchCourseItemStatus(courseId, id, 'COMPLETED')),
    ...(start !== null
      ? [patchCourseItemStatus(courseId, start, 'IN_PROGRESS')]
      : []),
  ])
}

export const getMycourses = async ({
  size,
  page,
}: {
  size?: number
  page?: number
}) => {
  const res = await apiClient.get<
    CommonResponse<Paginated<'tourCourses', CourseListDetail>>
  >('/api/v1/tour-courses', { params: { size, page } })

  return res.data.data
}
