import { createCourse } from '@/api/course'
import { getFestivals } from '@/api/festival'
import { getSavedPlaces } from '@/api/place'
import { saveUserPreferences } from '@/api/preference'
import { apiClient } from '@/lib/api-client'
import type { CourseItemPayload } from '@/types/course'
import type { UserPreferenceRequest } from '@/types/preference'
import type {
  CourseRecommendationData,
  CourseRecommendationRequest,
} from '@/types/recommendation'
import type { CommonResponse } from '@/types/response'
import type { CourseDeparture } from '@/components/course/recommend/use-course-recommend-form'

const TRAVEL_DAY_COUNT: Record<UserPreferenceRequest['travelTime'], number> = {
  HALF_DAY: 1,
  ONE_DAY: 1,
  ONE_NIGHT_TWO_DAYS: 2,
  TWO_NIGHTS_THREE_DAYS: 3,
  THREE_NIGHTS_FOUR_DAYS: 4,
}

function parseApiDate(value: string) {
  const match = value.match(/(\d{4})\D?(\d{1,2})\D?(\d{1,2})/)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
    ? parsed
    : null
}

function getActiveFestivalSpotIds(
  festivals: Awaited<ReturnType<typeof getFestivals>>,
  travelStartDate: string,
  travelTime: UserPreferenceRequest['travelTime'],
) {
  const tripStart = parseApiDate(travelStartDate)
  if (!tripStart) return []

  const tripEnd = new Date(tripStart)
  tripEnd.setUTCDate(tripEnd.getUTCDate() + TRAVEL_DAY_COUNT[travelTime] - 1)

  return festivals
    .filter((festival) => {
      const festivalStart = parseApiDate(festival.eventStartDate)
      const festivalEnd = parseApiDate(festival.eventEndDate)
      return (
        festivalStart !== null &&
        festivalEnd !== null &&
        festivalStart <= tripEnd &&
        festivalEnd >= tripStart
      )
    })
    .map((festival) => festival.spotId)
}

export async function recommendCourse(
  preference: UserPreferenceRequest,
  travelStartDate: string,
  departure: CourseDeparture | null,
) {
  const [savedResult, festivalResult] = await Promise.allSettled([
    getSavedPlaces(),
    getFestivals(),
  ])
  const savedPlaces =
    savedResult.status === 'fulfilled' ? savedResult.value.items : []
  const festivals =
    festivalResult.status === 'fulfilled' ? festivalResult.value : []

  const body: CourseRecommendationRequest = {
    travelTime: preference.travelTime,
    travelCompanion: preference.travelCompanion,
    preferredTravelTheme: preference.preferredTravelTheme,
    transportationMode: preference.transportationMode,
    withPet: false,
    travelStartDate,
    savedSpotIds: savedPlaces.flatMap((place) =>
      place.category === 'TOUR_SPOT' ? [place.spotId] : [],
    ),
    savedNearbyPlaceIds: savedPlaces.flatMap((place) =>
      place.category !== 'TOUR_SPOT' ? [place.nearbyPlaceId] : [],
    ),
    activeFestivalSpotIds: getActiveFestivalSpotIds(
      festivals,
      travelStartDate,
      preference.travelTime,
    ),
    departureCategory: departure?.category ?? null,
    departurePlaceId: departure?.placeId ?? null,
  }

  const res = await apiClient.post<CommonResponse<CourseRecommendationData>>(
    '/api/v1/recommendations/courses',
    body,
    { timeout: 120_000 },
  )

  return res.data.data
}

function toCourseItems(
  recommendation: CourseRecommendationData,
): CourseItemPayload[] {
  return recommendation.items.map((item) => {
    if (item.category === 'TOUR_SPOT' && item.spotId === null) {
      throw new Error('추천 관광지에 spotId가 없습니다.')
    }

    if (item.category !== 'TOUR_SPOT' && item.nearbyPlaceId === null) {
      throw new Error('추천 주변 장소에 nearbyPlaceId가 없습니다.')
    }

    return {
      category: item.category,
      spotId: item.category === 'TOUR_SPOT' ? item.spotId : null,
      nearbyPlaceId: item.category === 'TOUR_SPOT' ? null : item.nearbyPlaceId,
      itemOrder: item.itemOrder,
      dayNumber: item.dayNumber,
      transportType: item.transportType,
    }
  })
}

export async function generateRecommendedCourse({
  preference,
  travelStartDate,
  departure,
  title,
}: {
  preference: UserPreferenceRequest
  travelStartDate: string
  departure: CourseDeparture | null
  title: string
}) {
  await saveUserPreferences(preference)
  const recommendation = await recommendCourse(
    preference,
    travelStartDate,
    departure,
  )

  if (recommendation.items.length === 0) {
    throw new Error('추천할 수 있는 장소가 없습니다.')
  }

  return createCourse({
    title,
    shareYn: false,
    items: toCourseItems(recommendation),
  })
}
