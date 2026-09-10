import { apiClient } from '@/lib/api-client'
import { CommonResponse } from '@/types/response'
import { TourSpotMemoRequest, TourSpotMemoResponse } from '@/types/memo'

export const getTourSpotMemo = async (spotId: number) => {
  const res = await apiClient.get<CommonResponse<TourSpotMemoResponse>>(
    `/api/v1/memos/tour-spots/${spotId}`,
  )

  return res.data.data
}

export const saveTourSpotMemo = async ({
  spotId,
  ...body
}: { spotId: number } & TourSpotMemoRequest) => {
  const res = await apiClient.put<CommonResponse<TourSpotMemoResponse>>(
    `/api/v1/memos/tour-spots/${spotId}`,
    body,
  )

  return res.data.data
}

export const deleteTourSpotMemo = async (spotId: number) => {
  await apiClient.delete(`/api/v1/memos/tour-spots/${spotId}`)
}
