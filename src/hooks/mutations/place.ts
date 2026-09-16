import { useMutation } from '@tanstack/react-query'
import { clearStampMission, savePlace } from '@/api/place'
import { QUERY_KEY } from '@/constants/query-key'
import { queryClient } from '@/lib/query-client'
import type { NearbyPlaceDetail, TourSpotDetail } from '@/types/place'

const detailKey = (placeId: number, category: string) =>
  category === 'TOUR_SPOT'
    ? QUERY_KEY.place.tourSpot(placeId)
    : QUERY_KEY.place.nearbyPlace(placeId)

export const useTogglePlaceSave = () => {
  return useMutation({
    mutationFn: savePlace,
    // 장소 상세 캐시의 like를 즉시 반영(낙관적) → 저장 시 깜빡임 방지
    onMutate: async ({ placeId, category, save }) => {
      const key = detailKey(placeId, category)
      await queryClient.cancelQueries({ queryKey: key })
      const prev = queryClient.getQueryData<TourSpotDetail | NearbyPlaceDetail>(
        key,
      )
      if (prev) {
        queryClient.setQueryData(key, { ...prev, like: save })
      }
      return { key, prev }
    },
    // 실패 시 이전 값으로 롤백
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(ctx.key, ctx.prev)
    },
    // 성공/실패 무관하게 서버 확정값으로 재동기화 (저장 목록/마이페이지도 갱신)
    onSettled: (_data, _err, { placeId, category }) => {
      queryClient.invalidateQueries({ queryKey: detailKey(placeId, category) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.place.savedPlaces() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.my.page() })
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
