export type RouteTransportType = 'WALK' | 'BICYCLE' | 'PUBLIC_TRANSIT' | 'CAR'

export interface Coordinate {
  latitude: number
  longitude: number
  name?: string
}

export interface PlaceReference {
  category: 'TOUR_SPOT' | 'RESTAURANT' | 'ACCOMMODATION'
  spotId: number | null
  nearbyPlaceId: number | null
}

export interface RouteCalculationRequest {
  origin: PlaceReference
  destination: PlaceReference
  transportType: RouteTransportType
}

export interface RouteCalculationResponse {
  origin: Coordinate
  destination: Coordinate
  transportType: RouteTransportType
  distanceMeters: number
  durationSeconds: number
  distanceText: string
  durationText: string
  navigationUrl: string
}
