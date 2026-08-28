export type PlaceTrafficLevel = 'crowded' | 'moderate' | 'relaxed'

export type PlaceCategory = 'TOUR_SPOT' | 'RESTAURANT' | 'ACCOMMODATION'

interface TourSpotListItemBase {
  name: string
  img: string
  overview: string
  address: string
  latitude: number
  longitude: number
}

export type TourSpotListItem =
  | ({ category: 'TOUR_SPOT'; spotId: number; nearbyPlaceId: null } & TourSpotListItemBase)
  | ({ category: 'RESTAURANT' | 'ACCOMMODATION'; spotId: null; nearbyPlaceId: number } & TourSpotListItemBase)

export const getPlaceId = (item: TourSpotListItem) =>
  item.category === 'TOUR_SPOT' ? item.spotId : item.nearbyPlaceId

export interface TourSpotsResponse {
  places: TourSpotListItem[]
  page: number
  size: number
  totalCount: number
}

export interface TourSpotDetail {
  spotId: number
  name: string
  img: string
  content: string
  address: string
  canParking: boolean
  canPet: boolean
  like: boolean
  crowdLevel: number
  overview: string
  homepage: string | null
  mapX: number
  mapY: number
  contentId: number
  contentTypeId: number
  tel: string | null
}

export type NearbyPlaceCategory = 'RESTAURANT' | 'ACCOMMODATION'

export interface NearbyPlaceDetail {
  nearbyPlaceId: number
  spotId: number
  category: NearbyPlaceCategory
  name: string
  img: string | null
  overview: string | null
  address: string
  mood: string | null
  homepageUrl: string | null
  contentId: number
  contentTypeId: number
  mapX: number
  mapY: number
  openTime: string | null
  restDate: string | null
  reservationInfo: string | null
  inquiryInfo: string | null
  parkingInfo: string | null
  petInfo: string | null
  firstMenu: string | null
  treatMenu: string | null
}
