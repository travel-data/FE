import { useMemo } from 'react'
import type { CourseDetail, CourseDetailItem } from '@/types/course'
import type { CourseDay, CoursePlace } from '@/components/course/detail/course-day-tabs'

function buildPlace(
  item: CourseDetailItem,
  nextItem?: CourseDetailItem,
): CoursePlace {
  return {
    id: item.itemId,
    placeId: (item.spotId ?? item.nearbyPlaceId)!,
    placeCategory: item.category,
    name: item.name,
    img: item.img,
    address: item.address,
    description: item.overview ?? '',
    distanceToNext: null,
    transportToNext: nextItem?.transportType ?? null,
  }
}

// 코스 상세 아이템을 일차별로 그룹핑하고 각 일차 내에서 itemOrder로 정렬.
// 내 코스 상세화면과 공유 뷰어가 공유하는 표시용 파생 데이터.
export function useCourseDays(
  courseDetail: CourseDetail | undefined,
): CourseDay[] {
  return useMemo(() => {
    if (!courseDetail) return []

    const grouped = new Map<number, CourseDetailItem[]>()
    for (const item of courseDetail.items) {
      if (!grouped.has(item.dayNumber)) grouped.set(item.dayNumber, [])
      grouped.get(item.dayNumber)!.push(item)
    }

    return Array.from(grouped.entries()).map(([dayNumber, items]) => {
      const sorted = [...items].sort((a, b) => a.itemOrder - b.itemOrder)
      return {
        day: dayNumber,
        label: String(dayNumber),
        places: sorted.map((item, idx) => buildPlace(item, sorted[idx + 1])),
      }
    })
  }, [courseDetail])
}
