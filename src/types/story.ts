// 추천/오늘의 스토리카드 목록 아이템
export interface StoryCardSummary {
  storyId: number
  spotId: number
  tourSpotName: string
  title: string
  subTitle: string
  summary: string
  imageUrl: string
}

export interface StoryCardDetail {
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
