// 공유 코스 접근 토큰(비밀번호 검증 후 발급)을 코스별로 sessionStorage에 보관.
// 새로고침에도 유지되고, 탭을 닫으면 사라진다.
const key = (courseId: string) => `shared-course-token:${courseId}`

export const getSharedToken = (courseId: string) =>
  sessionStorage.getItem(key(courseId))

export const setSharedToken = (courseId: string, token: string) =>
  sessionStorage.setItem(key(courseId), token)

export const clearSharedToken = (courseId: string) =>
  sessionStorage.removeItem(key(courseId))
