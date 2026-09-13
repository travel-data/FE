import { apiClient } from '@/lib/api-client'
import type { CommonResponse } from '@/types/response'

export interface TourSpotSaveResponse {
  spotId: number
  like: boolean
}

export interface NearbyPlaceSaveResponse {
  nearbyPlaceId: number
  like: boolean
}

export async function saveTourSpot(
  spotId: number,
): Promise<TourSpotSaveResponse> {
  const res = await apiClient.post<CommonResponse<TourSpotSaveResponse>>(
    `/api/v1/tour-spots/${spotId}/save`,
  )

  return res.data.data
}

export async function deleteSavedTourSpot(
  spotId: number,
): Promise<TourSpotSaveResponse> {
  const res = await apiClient.delete<CommonResponse<TourSpotSaveResponse>>(
    `/api/v1/tour-spots/${spotId}/save`,
  )

  return res.data.data
}

export async function deleteSavedNearbyPlace(
  nearbyPlaceId: number,
): Promise<NearbyPlaceSaveResponse> {
  const res = await apiClient.delete<CommonResponse<NearbyPlaceSaveResponse>>(
    `/api/v1/tour-spots/nearby-places/${nearbyPlaceId}/save`,
  )

  return res.data.data
}
