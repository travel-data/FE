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

export interface MemoListItem {
  memoId: number
  spotId: number
  spotName: string
  spotImage: string | null
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface MemoListResponse {
  content: MemoListItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface TourSpotMemoRequest {
  content: string
}
