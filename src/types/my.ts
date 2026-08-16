export interface MyPageResponse {
  profile: {
    nickname: string
    profileImageUrl: string
  }
  savedSpots: {
    totalCount: number
    items: SavedSpotResponse[]
  }
  savedStories: {
    totalCount: number
    items: SavedStoryResponse[]
  }
  memos: {
    totalCount: number
    items: MyMemoResponse[]
  }
}

export interface SavedSpotResponse {
  spotId: number
  imageUrl: string
}

export interface SavedStoryResponse {
  storyId: number
  imageUrl: string
}

export interface MyMemoResponse {
  memoId: number
  content: string
  courseTitle: string
}
