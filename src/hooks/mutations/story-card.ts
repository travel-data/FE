import { deleteSavedStoryCard, saveStoryCard } from '@/api/story-card'
import { QUERY_KEY } from '@/constants/query-key'
import type { StoryCardDetailResponse } from '@/types/story-card'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface ToggleStoryCardSaveVariables {
  storyId: number
  spotId: number
  saved: boolean
}

export function useToggleStoryCardSave() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ storyId, saved }: ToggleStoryCardSaveVariables) =>
      saved ? deleteSavedStoryCard(storyId) : saveStoryCard(storyId),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<StoryCardDetailResponse>(
        QUERY_KEY.storyCard.detail(variables.spotId),
        (current) => (current ? { ...current, saved: result.saved } : current),
      )
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.storyCard.savedAll(),
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.my.page() })
    },
  })
}
