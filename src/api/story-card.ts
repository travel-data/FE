import { apiClient } from '@/lib/api-client'
import type { CommonResponse } from '@/types/response'
import type {
  SavedStoryCardListResponse,
  StoryCardDetailResponse,
  StoryCardSaveResponse,
} from '@/types/story-card'

export async function getStoryCardDetail(
  spotId: number,
): Promise<StoryCardDetailResponse> {
  const response = await apiClient.get<CommonResponse<StoryCardDetailResponse>>(
    `/api/v1/story-cards/tour-spots/${spotId}`,
  )

  return response.data.data
}

export async function saveStoryCard(
  storyId: number,
): Promise<StoryCardSaveResponse> {
  const response = await apiClient.post<CommonResponse<StoryCardSaveResponse>>(
    `/api/v1/story-cards/${storyId}/save`,
  )

  return response.data.data
}

export async function deleteSavedStoryCard(
  storyId: number,
): Promise<StoryCardSaveResponse> {
  const response = await apiClient.delete<
    CommonResponse<StoryCardSaveResponse>
  >(`/api/v1/story-cards/${storyId}/save`)

  return response.data.data
}

export async function getSavedStoryCards({
  page = 0,
  size = 20,
}: {
  page?: number
  size?: number
} = {}): Promise<SavedStoryCardListResponse> {
  const response = await apiClient.get<
    CommonResponse<SavedStoryCardListResponse>
  >('/api/v1/story-cards/saved', { params: { page, size } })

  return response.data.data
}
