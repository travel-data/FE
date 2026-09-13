import { createCourse } from '@/api/course'
import { saveUserPreferences } from '@/api/preference'
import { RECOMMENDATION_API_BASE_URL } from '@/constants/api'
import type { CourseItemPayload } from '@/types/course'
import type { UserPreferenceRequest } from '@/types/preference'
import type {
  CourseRecommendationData,
  CourseRecommendationRequest,
} from '@/types/recommendation'
import type { CommonResponse } from '@/types/response'
import axios from 'axios'

const recommendationClient = axios.create({
  baseURL: RECOMMENDATION_API_BASE_URL,
  timeout: 120_000,
})

export async function recommendCourse(preference: UserPreferenceRequest) {
  const body: CourseRecommendationRequest = {
    travelTime: preference.travelTime,
    travelCompanion: preference.travelCompanion,
    preferredTravelTheme: preference.preferredTravelTheme,
    transportationMode: preference.transportationMode,
    withPet: false,
    latitude: preference.latitude,
    longitude: preference.longitude,
  }

  const res = await recommendationClient.post<
    CommonResponse<CourseRecommendationData>
  >('/api/v1/recommendations/courses', body)

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
  title,
}: {
  preference: UserPreferenceRequest
  title: string
}) {
  await saveUserPreferences(preference)
  const recommendation = await recommendCourse(preference)

  if (recommendation.items.length === 0) {
    throw new Error('추천할 수 있는 장소가 없습니다.')
  }

  return createCourse({
    title,
    shareYn: false,
    items: toCourseItems(recommendation),
  })
}
