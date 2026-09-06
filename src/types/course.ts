import { PlaceCategory } from './place'

export type TransportationType = 'WALK' | 'CAR' | 'BIKE'

export type PlaceItem =
  | {
      itemId?: number | null
      category: 'TOUR_SPOT'
      spotId: number
      nearbyPlaceId: null
      name: string
      img: string
      address: string
    }
  | {
      itemId?: number | null
      category: 'RESTAURANT' | 'ACCOMMODATION'
      spotId: null
      nearbyPlaceId: number
      name: string
      img: string
      address: string
    }

export function toPlaceItem({
  itemId,
  category,
  spotId,
  nearbyPlaceId,
  name,
  img,
  address,
}: {
  itemId?: number | null
  category: PlaceCategory
  spotId: number | null
  nearbyPlaceId: number | null
  name: string
  img: string | null
  address: string
}): PlaceItem {
  return category === 'TOUR_SPOT'
    ? {
        itemId,
        category: 'TOUR_SPOT',
        spotId: spotId!,
        nearbyPlaceId: null,
        name,
        img: img ?? '',
        address,
      }
    : {
        itemId,
        category: category as 'RESTAURANT' | 'ACCOMMODATION',
        spotId: null,
        nearbyPlaceId: nearbyPlaceId!,
        name,
        img: img ?? '',
        address,
      }
}

export type CourseStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export type CourseItemPayload = {
  itemId?: number | null
  category: PlaceCategory
  spotId: number | null
  nearbyPlaceId: number | null
  itemOrder: number
  transportType: TransportationType | null
  dayNumber: number
}

export type CourseRequest = {
  title: string
  shareYn: boolean
  sharedPassword?: string | null
  items: CourseItemPayload[]
}

export type CreateCourseResponse = {
  tourCourseId: number
  title: string
  shareYn: boolean
  itemCount: number
  createdAt: string
}

export interface CourseDetailItem {
  itemId: number
  dayNumber: number
  itemOrder: number
  category: PlaceCategory
  spotId: number | null
  nearbyPlaceId: number | null
  parentTourSpotId: number | null
  name: string
  img: string | null
  overview: string | null
  address: string
  latitude: number
  longitude: number
  like: boolean
  transportType: TransportationType | null
  status: CourseStatus
}

export interface CourseDetail {
  tourCourseId: number
  title: string
  shareYn: boolean
  items: CourseDetailItem[]
  totalDistanceMeter: number
  totalDurationSecond: number
  createdAt: string
  updatedAt: string
  status: CourseStatus
}

export interface CourseListDetail {
  tourCourseId: number
  title: string
  shareYn: boolean
  status: CourseStatus
  thumbnailImg: string
  itemCount: number
  createdAt: string
  updatedAt: string
}
