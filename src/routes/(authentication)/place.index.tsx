import { createFileRoute } from '@tanstack/react-router'
import PlaceExploreView from '@/components/place/place-explore-view'
import { getPlaceId } from '@/types/place'
import { usePlaceDetailSheetStore } from '@/stores/place-detail-sheet-store'
import BackButton from '@/components/button/back-button'
import { useAuth } from '@/stores/auth-store'

export const Route = createFileRoute('/(authentication)/place/')({
  component: RouteComponent,
})

function RouteComponent() {
  const openPlaceDetail = usePlaceDetailSheetStore((s) => s.open)
  const { role } = useAuth()

  // 조회 전용: actionButton 미주입 → 상세 시트 기본 액션(길찾기 + 닫기)
  // 게스트는 저장/북마크 액션을 숨기기 위해 readOnly로 연다
  return (
    <PlaceExploreView
      topLeftSlot={<BackButton />}
      onSelectPlace={(place) =>
        openPlaceDetail(getPlaceId(place), place.category, {
          readOnly: role !== 'user',
        })
      }
    />
  )
}
