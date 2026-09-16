// 로그인 유도 시점 경로를 저장해, 로그인(OAuth 왕복) 후 그 화면으로 복귀시킨다.
// sessionStorage는 같은 탭/origin이면 OAuth 리다이렉트에도 유지된다.
const KEY = 'auth-return-url'

export const setAuthReturnUrl = (url: string) =>
  sessionStorage.setItem(KEY, url)

// 한 번 읽고 제거 (복귀는 1회성)
export const takeAuthReturnUrl = () => {
  const url = sessionStorage.getItem(KEY)
  if (url) sessionStorage.removeItem(KEY)
  return url
}
