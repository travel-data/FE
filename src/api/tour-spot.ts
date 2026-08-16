import { apiClient } from '@/lib/api-client'
import type { CommonResponse } from '@/types/response'

export interface TourSpotSaveResponse {
  spotId: number
  like: boolean
}

export async function deleteSavedTourSpot(
  spotId: number,
): Promise<TourSpotSaveResponse> {
  const res = await apiClient.delete<CommonResponse<TourSpotSaveResponse>>(
    `/api/v1/tour-spots/${spotId}/save`,
  )

  return res.data.data
}
