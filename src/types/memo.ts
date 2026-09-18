export interface TourSpotMemo {
  memoId: number
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface TourSpotMemoResponse {
  spotId: number
  memo: TourSpotMemo | null
}

export type Memo = TourSpotMemo

interface MemoListItemBase {
  memoId: number
  spotName: string
  spotImage: string | null
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export type MemoListItem = MemoListItemBase &
  (
    | { category: 'TOUR_SPOT'; spotId: number; nearbyPlaceId: null }
    | {
        category: 'RESTAURANT' | 'ACCOMMODATION'
        spotId: null
        nearbyPlaceId: number
      }
  )

export interface MemoListResponse {
  content: MemoListItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface TourSpotMemoRequest {
  content: string
  imageUrl?: string | null
}

export interface NearbyPlaceMemoResponse {
  nearbyPlaceId: number
  memo: TourSpotMemo | null
}
