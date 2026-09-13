import { apiClient } from '@/lib/api-client'
import type {
  MemoListResponse,
  TourSpotMemoRequest,
  TourSpotMemoResponse,
} from '@/types/memo'
import type { CommonResponse } from '@/types/response'

export const getTourSpotMemo = async (spotId: number) => {
  const res = await apiClient.get<CommonResponse<TourSpotMemoResponse>>(
    `/api/v1/memos/tour-spots/${spotId}`,
  )

  return res.data.data
}

type SaveTourSpotMemoVariables =
  | ({ spotId: number } & TourSpotMemoRequest)
  | { spotId: number; body: TourSpotMemoRequest }

export const saveTourSpotMemo = async (variables: SaveTourSpotMemoVariables) => {
  const { spotId } = variables
  const body =
    'body' in variables
      ? variables.body
      : { content: variables.content }

  const res = await apiClient.put<CommonResponse<TourSpotMemoResponse>>(
    `/api/v1/memos/tour-spots/${spotId}`,
    body,
  )

  return res.data.data
}

export const deleteTourSpotMemo = async (spotId: number) => {
  await apiClient.delete(`/api/v1/memos/tour-spots/${spotId}`)
}

export async function getMemoList({
  page = 0,
  size = 20,
}: {
  page?: number
  size?: number
} = {}): Promise<MemoListResponse> {
  const res = await apiClient.get<CommonResponse<MemoListResponse>>(
    '/api/v1/memos',
    { params: { page, size } },
  )

  return res.data.data
}
