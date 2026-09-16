export interface StoryCardDetailResponse {
  storyId: number
  spotId: number
  tourSpotName: string
  title: string
  subTitle: string
  summary: string
  intro: string
  storyTitle: string
  story: string
  imageUrl: string
  tip: string
  didYouKnow: string
  hashtags: string[]
  saved: boolean
}

export interface StoryCardSaveResponse {
  storyId: number
  saved: boolean
}

export interface SavedStoryCardListItem {
  storyId: number
  spotId: number
  tourSpotName: string
  title: string
  subTitle: string
  summary: string
  imageUrl: string
  savedAt: string
}

export interface SavedStoryCardListResponse {
  content: SavedStoryCardListItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
