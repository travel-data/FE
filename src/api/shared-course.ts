import { sharedCourseClient } from '@/lib/shared-course-client'
import { CourseDetail, VerifyPasswordResponse } from '@/types/course'
import { CommonResponse } from '@/types/response'
import { isAxiosError } from 'axios'

// 공유 토큰 없음/만료(재입력 필요)를 나타내는 응답 상태
export const isSharedAccessError = (error: unknown) =>
  isAxiosError(error) &&
  (error.response?.status === 401 || error.response?.status === 403)

// 공유 코스 비밀번호 검증 → 성공 시 접근 토큰(accessToken) 발급
export const verifySharedPassword = async (
  courseId: string,
  password: string,
) => {
  const res = await sharedCourseClient.post<
    CommonResponse<VerifyPasswordResponse>
  >(`/api/v1/tour-courses/${courseId}/password/verify`, { password })

  return res.data.data
}

// 공유 코스 공개 상세 조회.
// - 공개(featured) 코스: 토큰 없이 조회 가능
// - 공유 코스: X-Course-Access-Token(비번 검증 토큰)이 있어야 조회 가능. 없으면 403.
export const getPublicCourse = async (
  courseId: string,
  accessToken?: string | null,
) => {
  const res = await sharedCourseClient.get<CommonResponse<CourseDetail>>(
    `/api/v1/tour-courses/${courseId}/public`,
    accessToken
      ? { headers: { 'X-Course-Access-Token': accessToken } }
      : undefined,
  )

  return res.data.data
}
