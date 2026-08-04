import { apiClient } from '@/lib/api-client'
import type { FestivalDetailResponse, FestivalResponse } from '@/types/festival'
import { CommonResponse } from '@/types/response'

export async function getFestivals(): Promise<FestivalResponse[]> {
  const res =
    await apiClient.get<CommonResponse<FestivalResponse[]>>('/api/v1/event')
  return res.data.data
}

export async function getFestivalDetail(
  spotId: number,
): Promise<FestivalDetailResponse> {
  const res = await apiClient.get<CommonResponse<FestivalDetailResponse>>(
    `/api/v1/event/${spotId}`,
  )
  return res.data.data
}
