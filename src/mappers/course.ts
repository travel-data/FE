import type {
  CourseDetail,
  CourseDetailItem,
  CourseItemPayload,
  CourseRequest,
} from '@/types/course'
import type { NearbyPlaceCategory } from '@/types/place'

// 코스 상세의 아이템을 수정 요청 payload로 변환.
// 공유 설정/중단/비번수정처럼 items는 그대로 두고 공유 필드만 바꿀 때 사용.
export function toCourseItemPayload(item: CourseDetailItem): CourseItemPayload {
  return {
    itemId: item.itemId,
    category: item.category,
    spotId: item.spotId,
    nearbyPlaceId: item.nearbyPlaceId,
    itemOrder: item.itemOrder,
    transportType: item.transportType,
    dayNumber: item.dayNumber,
  }
}

// 추천 코스 상세를 "새 코스" 생성 요청으로 변환.
// 새로 만드는 코스이므로 itemId는 넣지 않고(null), 공유는 꺼둔다.
export function toCreateCourseRequest(detail: CourseDetail): CourseRequest {
  return {
    title: detail.title,
    shareYn: false,
    items: detail.items.map((item) => ({
      ...toCourseItemPayload(item),
      itemId: null,
    })),
  }
}

// 진행 중(IN_PROGRESS) 장소 바로 다음에 주변 장소(nearby)를 삽입한 수정 요청 생성.
// 같은 일차에 넣고, 일차별 itemOrder를 1부터 연속으로 재계산한다.
export function insertNearbyAfterCurrent(
  detail: CourseDetail,
  place: { nearbyPlaceId: number; category: NearbyPlaceCategory },
): CourseRequest {
  const sorted = [...detail.items].sort(
    (a, b) => a.dayNumber - b.dayNumber || a.itemOrder - b.itemOrder,
  )
  const payloads: CourseItemPayload[] = sorted.map(toCourseItemPayload)

  const current = sorted.find((i) => i.status === 'IN_PROGRESS')
  if (current) {
    const idx = payloads.findIndex((p) => p.itemId === current.itemId)
    payloads.splice(idx + 1, 0, {
      itemId: null,
      category: place.category,
      spotId: null,
      nearbyPlaceId: place.nearbyPlaceId,
      itemOrder: 0, // 아래에서 재계산
      transportType: 'WALK',
      dayNumber: current.dayNumber,
    })
  }

  // 일차별 itemOrder를 1부터 연속으로 재계산
  const orderByDay = new Map<number, number>()
  const items = payloads.map((p) => {
    const order = (orderByDay.get(p.dayNumber) ?? 0) + 1
    orderByDay.set(p.dayNumber, order)
    return { ...p, itemOrder: order }
  })

  return {
    title: detail.title,
    shareYn: detail.shareYn,
    sharedPassword: detail.sharedPassword,
    items,
  }
}
