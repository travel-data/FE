import { useMutation } from '@tanstack/react-query'
import { clearStampMission, savePlace } from '@/api/place'
import { QUERY_KEY } from '@/constants/query-key'
import { queryClient } from '@/lib/query-client'
import type { PlaceCategory } from '@/types/place'

export const useTogglePlaceSave = () => {
  return useMutation({
    mutationFn: savePlace,
    onSuccess: (_, { placeId, category }: { placeId: number; category: PlaceCategory; save: boolean }) => {
      queryClient.invalidateQueries({
        queryKey:
          category === 'TOUR_SPOT'
            ? QUERY_KEY.place.tourSpot(placeId)
            : QUERY_KEY.place.nearbyPlace(placeId),
      })
    },
  })
}

export const useClearStampMission = () => {
  return useMutation({
    mutationFn: clearStampMission,
    // 완료 후 관광지 상세를 다시 불러와 stampProgress 갱신
    onSuccess: (_, { spotId }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.place.tourSpot(spotId),
      })
    },
  })
}
