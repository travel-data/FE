import { apiClient } from '@/lib/api-client'
import type {
  MemoListItem,
  MemoListResponse,
  NearbyPlaceMemoResponse,
  TourSpotMemoRequest,
  TourSpotMemoResponse,
} from '@/types/memo'
import type { CommonResponse } from '@/types/response'

type ApiMemoListItem = Omit<MemoListItem, 'category'> & { category: string }

function normalizeMemoCategory(item: ApiMemoListItem): MemoListItem {
  if (item.spotId !== null) {
    return {
      ...item,
      spotId: item.spotId,
      nearbyPlaceId: null,
      category: 'TOUR_SPOT',
    }
  }

  if (item.nearbyPlaceId === null) {
    throw new Error('Memo has no associated place')
  }

  const category = item.category.toUpperCase()
  if (category === 'RESTAURANT' || category === 'FOOD') {
    return {
      ...item,
      spotId: null,
      nearbyPlaceId: item.nearbyPlaceId,
      category: 'RESTAURANT',
    }
  }
  if (category === 'ACCOMMODATION' || category === 'LODGING') {
    return {
      ...item,
      spotId: null,
      nearbyPlaceId: item.nearbyPlaceId,
      category: 'ACCOMMODATION',
    }
  }

  throw new Error(`Unknown memo place category: ${item.category}`)
}

export const getTourSpotMemo = async (spotId: number) => {
  const res = await apiClient.get<CommonResponse<TourSpotMemoResponse>>(
    `/api/v1/memos/tour-spots/${spotId}`,
  )

  return res.data.data
}

type SaveTourSpotMemoVariables =
  | ({ spotId: number } & TourSpotMemoRequest)
  | { spotId: number; body: TourSpotMemoRequest }

export const saveTourSpotMemo = async (
  variables: SaveTourSpotMemoVariables,
) => {
  const { spotId } = variables
  const body =
    'body' in variables
      ? variables.body
      : { content: variables.content, imageUrl: variables.imageUrl }

  const res = await apiClient.put<CommonResponse<TourSpotMemoResponse>>(
    `/api/v1/memos/tour-spots/${spotId}`,
    body,
  )

  return res.data.data
}

export const deleteTourSpotMemo = async (spotId: number) => {
  await apiClient.delete(`/api/v1/memos/tour-spots/${spotId}`)
}

export const getNearbyPlaceMemo = async (nearbyPlaceId: number) => {
  const res = await apiClient.get<CommonResponse<NearbyPlaceMemoResponse>>(
    `/api/v1/memos/nearby-places/${nearbyPlaceId}`,
  )
  return res.data.data
}

export const saveNearbyPlaceMemo = async ({
  nearbyPlaceId,
  body,
}: {
  nearbyPlaceId: number
  body: TourSpotMemoRequest
}) => {
  const res = await apiClient.put<CommonResponse<NearbyPlaceMemoResponse>>(
    `/api/v1/memos/nearby-places/${nearbyPlaceId}`,
    body,
  )
  return res.data.data
}

export const deleteNearbyPlaceMemo = async (nearbyPlaceId: number) => {
  await apiClient.delete(`/api/v1/memos/nearby-places/${nearbyPlaceId}`)
}

export async function getMemoList({
  page = 0,
  size = 20,
}: {
  page?: number
  size?: number
} = {}): Promise<MemoListResponse> {
  const res = await apiClient.get<
    CommonResponse<
      Omit<MemoListResponse, 'content'> & { content: ApiMemoListItem[] }
    >
  >('/api/v1/memos', { params: { page, size } })

  return {
    ...res.data.data,
    content: res.data.data.content.map(normalizeMemoCategory),
  }
}
