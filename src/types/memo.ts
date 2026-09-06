export interface Memo {
  memoId: number
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface TourSpotMemoResponse {
  spotId: number
  memo: Memo | null
}

// content 필수(최대 1000자). imageUrl은 업로드 API 부재로 현재 미사용
export interface TourSpotMemoRequest {
  content: string
  imageUrl?: string
}
