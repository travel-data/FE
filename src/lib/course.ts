import type { CourseDetailItem } from '@/types/course'

export interface CourseDay {
  dayNumber: number
  items: CourseDetailItem[]
}

/** 코스 아이템을 일차(dayNumber)별로 묶어 정렬된 days 배열로 변환 */
export function groupItemsByDay(items: CourseDetailItem[]): CourseDay[] {
  const byDay = new Map<number, CourseDetailItem[]>()

  for (const item of items) {
    const day = byDay.get(item.dayNumber) ?? []
    day.push(item)
    byDay.set(item.dayNumber, day)
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([dayNumber, dayItems]) => ({
      dayNumber,
      items: dayItems.sort((a, b) => a.itemOrder - b.itemOrder),
    }))
}
