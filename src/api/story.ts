import { apiClient } from '@/lib/api-client'
import { CommonResponse } from '@/types/response'
import { StoryCardDetail } from '@/types/story'

export const getTourSpotStoryCard = async (spotId: number) => {
  const res = await apiClient.get<CommonResponse<StoryCardDetail>>(
    `/api/v1/story-cards/tour-spots/${spotId}`,
  )

  return res.data.data
}
