import { apiClient } from '@/lib/api-client'
import { CommonResponse } from '@/types/response'
import {
  NearbyPlaceCategory,
  NearbyPlaceDetail,
  NearbyPlaceListResponse,
  PlaceCategory,
  StampMissionClearResponse,
  StampMissionType,
  StampProgress,
  SavedPlaceListItem,
  SavedPlacesResponse,
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
  const res = await apiClient.get<
    CommonResponse<{
      tourSpot: Omit<TourSpotDetail, 'stampProgress'>
      stampProgress: StampProgress | null
    }>
  >(`/api/v1/tour-spots/${spotId}`)

  // stampProgress를 tourSpot에 병합해 기존 필드 접근을 유지하면서 미션 상태도 노출
  const stampProgress = res.data.data.stampProgress ?? {
    clearedCount: 0,
    totalCount: 3,
    allCleared: false,
    missions: [
      { type: 'VISIT' as const, cleared: false, clearedAt: null },
      { type: 'QR_SCAN' as const, cleared: false, clearedAt: null },
      { type: 'STORY_CARD' as const, cleared: false, clearedAt: null },
    ],
  }

  return { ...res.data.data.tourSpot, stampProgress }
}

export const clearStampMission = async ({
  spotId,
  missionType,
}: {
  spotId: number
  missionType: StampMissionType
}) => {
  const res = await apiClient.put<CommonResponse<StampMissionClearResponse>>(
    `/api/v1/tour-spots/${spotId}/stamp-missions/${missionType}/clear`,
  )

  return res.data.data
}

export const getNearbyPlaceDetail = async (nearbyPlaceId: number) => {
  const res = await apiClient.get<CommonResponse<NearbyPlaceDetail>>(
    `/api/v1/nearby-places/${nearbyPlaceId}`,
  )

  return res.data.data
}

// 관광지 주변 장소(식당·숙소) 목록 조회
export const getNearbyPlaces = async ({
  spotId,
  category,
  page = 0,
  size = 20,
}: {
  spotId: number
  category?: NearbyPlaceCategory
  page?: number
  size?: number
}): Promise<NearbyPlaceListResponse> => {
  const res = await apiClient.get<CommonResponse<NearbyPlaceListResponse>>(
    `/api/v1/tour-spots/${spotId}/nearby-places`,
    { params: { category, page, size } },
  )

  return res.data.data
}

// 카테고리에 따라 관광지/주변장소 저장 엔드포인트 분기. save=true면 POST, false면 DELETE
export const savePlace = async ({
  placeId,
  category,
  save,
}: {
  placeId: number
  category: PlaceCategory
  save: boolean
}) => {
  const path =
    category === 'TOUR_SPOT'
      ? `/api/v1/tour-spots/${placeId}/save`
      : `/api/v1/tour-spots/nearby-places/${placeId}/save`

  if (save) await apiClient.post(path)
  else await apiClient.delete(path)
}

type SavedPlacesApiData =
  | SavedPlacesResponse
  | SavedPlaceListItem[]
  | { places: SavedPlaceListItem[]; totalCount?: number }

export const getSavedPlaces = async (): Promise<SavedPlacesResponse> => {
  const res = await apiClient.get<CommonResponse<SavedPlacesApiData>>(
    '/api/v1/tour-spots/saved',
  )
  const data = res.data.data

  if (Array.isArray(data)) {
    return { items: data, totalCount: data.length }
  }

  if ('places' in data) {
    return {
      items: data.places,
      totalCount: data.totalCount ?? data.places.length,
    }
  }

  return data
}
