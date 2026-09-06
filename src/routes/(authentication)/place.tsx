import { createFileRoute } from '@tanstack/react-router'
import PlaceExploreView from '@/components/place/place-explore-view'
import { getPlaceId } from '@/types/place'
import { usePlaceDetailSheetStore } from '@/stores/place-detail-sheet-store'
import BackButton from '@/components/button/back-button'

export const Route = createFileRoute('/(authentication)/place')({
  component: RouteComponent,
})

function RouteComponent() {
  const openPlaceDetail = usePlaceDetailSheetStore((s) => s.open)

  // 조회 전용: actionButton 미주입 → 상세 시트 기본 액션(길찾기 + 닫기)
  return (
    <PlaceExploreView
      showCurrentLocation
      topLeftSlot={<BackButton />}
      onSelectPlace={(place) =>
        openPlaceDetail(getPlaceId(place), place.category)
      }
    />
  )
}
