export type TravelTime =
  | 'HALF_DAY'
  | 'ONE_DAY'
  | 'ONE_NIGHT_TWO_DAYS'
  | 'TWO_NIGHTS_THREE_DAYS'
  | 'THREE_NIGHTS_FOUR_DAYS'

export type TravelCompanion = 'ALONE' | 'PARTNER' | 'FRIENDS' | 'FAMILY'

export type PreferredTravelTheme =
  | 'HISTORY_CULTURE'
  | 'NATURE_SCENERY'
  | 'FOOD'

export type TransportationMode =
  | 'WALK_PUBLIC_TRANSIT'
  | 'BICYCLE'
  | 'CAR'

export interface UserPreferenceRequest {
  hasTravelPlan: boolean
  travelTime: TravelTime
  travelCompanion: TravelCompanion
  preferredTravelTheme: PreferredTravelTheme | null
  transportationMode: TransportationMode
  latitude: number | null
  longitude: number | null
}

export type UserPreferenceResponse = UserPreferenceRequest
