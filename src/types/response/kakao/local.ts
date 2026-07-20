export interface KakaoLocalDocument {
  id: string
  place_name: string
  category_name: string
  category_group_code: string
  category_group_name: string
  phone: string
  address_name: string
  road_address_name: string
  x: string
  y: string
  place_url: string
  distance?: string
}

export interface KakaoLocalSameName {
  region: string[]
  keyword: string
  selected_region: string
}

export interface KakaoLocalMeta {
  total_count: number
  pageable_count: number
  is_end: boolean
  same_name: KakaoLocalSameName
}

export interface KakaoSearchKeywordResponse {
  documents: KakaoLocalDocument[]
  meta: KakaoLocalMeta
}

export interface KakaoLocalAddress {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  mountain_yn: string
  main_address_no: string
  sub_address_no: string
}

export interface KakaoLocalRoadAddress {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  road_name: string
  underground_yn: string
  main_building_no: string
  sub_building_no: string
  building_name: string
  zone_no: string
}

export interface KakaoCoordToAddressDocument {
  address: KakaoLocalAddress
  road_address: KakaoLocalRoadAddress | null
}

export interface KakaoCoordToAddressMeta {
  total_count: number
}

export interface KakaoCoordToAddressResponse {
  documents: KakaoCoordToAddressDocument[]
  meta: KakaoCoordToAddressMeta
}
