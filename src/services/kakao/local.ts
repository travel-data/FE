import { kakao } from '../instance'
import type {
  KakaoCoordToAddressResponse,
  KakaoSearchKeywordResponse,
} from '@/types/response/kakao/local'

export const getSearchAddress = async ({
  query,
  page,
}: {
  query: string
  page: number
}) => {
  const response = await kakao.get<KakaoSearchKeywordResponse>(
    `/local/search/keyword`,
    {
      params: {
        query,
        page,
      },
    },
  )

  return response.data
}

export const getGeocordAddress = async ({
  longitude,
  latitude,
}: {
  longitude: string
  latitude: string
}) => {
  const response = await kakao.get<KakaoCoordToAddressResponse>(
    'local/geo/coord2address',
    {
      params: {
        x: longitude,
        y: latitude,
      },
    },
  )

  return response.data
}
