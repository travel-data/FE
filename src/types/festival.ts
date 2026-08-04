export type FestivalStatus = 'ONGOING' | 'UPCOMING'

export interface FestivalResponse {
  spotId: number
  name: string
  img: string
  eventStartDate: string
  eventEndDate: string
  status: FestivalStatus
}

export interface FestivalDetailResponse {
  spotId: number
  name: string
  img: string
  address: string
  overview: string
  homepage: string
  mapX: number
  mapY: number
  contentId: number
  contentTypeId: number
  tel: string
  eventStartDate: string
  eventEndDate: string
}
