import { create } from 'axios'

export const kakao = create({
  baseURL: 'https://dapi.kakao.com/v2',
  headers: {
    Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
    'Content-Type': 'application/json;charset=UTF-8',
  },
})
