import i18n from '@/lib/i18n'
import type { PlaceCategory } from '@/types/place'
import type { TransportationType } from '@/types/course'

const PLACE_TYPE_LABEL_KEY = {
  TOUR_SPOT: 'place:type.attraction',
  RESTAURANT: 'place:type.restaurant',
  ACCOMMODATION: 'place:type.accommodation',
} as const

export function placeCategoryLabel(category: PlaceCategory) {
  return i18n.t(PLACE_TYPE_LABEL_KEY[category])
}

const TRANSPORTATION_LABEL_KEY = {
  WALK: 'course:transportation.WALK',
  CAR: 'course:transportation.CAR',
  BIKE: 'course:transportation.BIKE',
} as const

export function transportationLabel(type: TransportationType) {
  return i18n.t(TRANSPORTATION_LABEL_KEY[type])
}

// 코스 카드/노트에서 공용으로 쓰는 날짜·거리·소요시간 포맷터.
// 컴포넌트 밖(모듈 스코프)에서도 쓰이므로 i18n 싱글톤으로 번역한다.
export function formatCourseDateRange(createdAt?: string, updatedAt?: string) {
  const start = createdAt ? createdAt.slice(2, 10).replace(/-/g, '.') : ''
  const end = updatedAt ? updatedAt.slice(2, 10).replace(/-/g, '.') : start

  if (!start) return i18n.t('my:travel_note.no_date')
  return `${start} ~ ${end}`
}

export function formatCourseDistance(distanceMeter?: number) {
  if (!distanceMeter) return i18n.t('my:travel_note.no_distance')
  return `${(distanceMeter / 1000).toFixed(1)}km`
}

export function formatCourseDuration(durationSecond?: number) {
  if (!durationSecond) return i18n.t('my:travel_note.no_duration')

  const hours = Math.floor(durationSecond / 3600)
  const minutes = Math.round((durationSecond % 3600) / 60)

  if (hours <= 0) return i18n.t('duration.minutes', { count: minutes })
  if (minutes <= 0) return i18n.t('duration.hours', { count: hours })
  return `${i18n.t('duration.hours', { count: hours })} ${i18n.t('duration.minutes', { count: minutes })}`
}
