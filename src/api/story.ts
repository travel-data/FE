import { apiClient } from '@/lib/api-client'
import { CommonResponse } from '@/types/response'
import { StoryCardDetail, StoryCardSummary } from '@/types/story'

export const getTourSpotStoryCard = async (spotId: number) => {
  const res = await apiClient.get<CommonResponse<StoryCardDetail>>(
    `/api/v1/story-cards/tour-spots/${spotId}`,
  )

  return res.data.data
}

// 오늘의(추천) 스토리카드 목록 조회
export const getFeaturedStoryCards = async (size = 1) => {
  const res = await apiClient.get<CommonResponse<StoryCardSummary[]>>(
    '/api/v1/story-cards/featured',
    { params: { size } },
  )

  return res.data.data
}
