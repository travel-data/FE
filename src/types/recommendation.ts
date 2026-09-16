import type { TransportationType } from './course'
import type {
  PreferredTravelTheme,
  TransportationMode,
  TravelCompanion,
  TravelTime,
} from './preference'

export interface CourseRecommendationRequest {
  travelTime: TravelTime
  travelCompanion: TravelCompanion
  preferredTravelTheme: PreferredTravelTheme | null
  transportationMode: TransportationMode
  withPet: boolean
  latitude: number | null
  longitude: number | null
}

export interface CourseRecommendationItem {
  itemOrder: number
  dayNumber: number
  category: 'TOUR_SPOT' | 'RESTAURANT' | 'ACCOMMODATION'
  spotId: number | null
  nearbyPlaceId: number | null
  name: string
  latitude: number
  longitude: number
  distanceFromPreviousMeter: number
  durationFromPreviousSecond: number
  visitDurationMinute: number
  similarity: number
  transportType: TransportationType
}

export interface CourseRecommendationData {
  concept: string
  totalSpotCount: number
  totalDurationMinute: number
  items: CourseRecommendationItem[]
}
