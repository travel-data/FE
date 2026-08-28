import { apiClient } from '@/lib/api-client'
import { CommonResponse } from '@/types/response'
import {
  NearbyPlaceDetail,
  PlaceCategory,
  TourSpotDetail,
  TourSpotsResponse,
} from '@/types/place'

export const getTourSpots = async ({
  category,
  keyword,
  page = 0,
  size = 20,
}: {
  category?: PlaceCategory
  keyword?: string
  page?: number
  size?: number
}): Promise<TourSpotsResponse> => {
  const res = await apiClient.get<CommonResponse<TourSpotsResponse>>(
    '/api/v1/tour-spots',
    { params: { category, keyword, page, size } },
  )
  return res.data.data
}

export const getTourSpotDetail = async (spotId: number) => {
  const res = await apiClient.get<CommonResponse<{ tourSpot: TourSpotDetail }>>(
    `/api/v1/tour-spots/${spotId}`,
  )

  return res.data.data.tourSpot
}

export const getNearbyPlaceDetail = async (nearbyPlaceId: number) => {
  const res = await apiClient.get<CommonResponse<NearbyPlaceDetail>>(
    `/api/v1/nearby-places/${nearbyPlaceId}`,
  )

  return res.data.data
}
