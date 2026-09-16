import { create } from 'zustand'
import type { ReactNode } from 'react'
import type { PlaceCategory } from '@/types/place'

interface OpenOptions {
  actionButton?: ReactNode
  // 공유 뷰어처럼 조회 전용일 때 저장/북마크 등 액션을 숨긴다.
  readOnly?: boolean
}

interface PlaceDetailSheetState {
  isOpen: boolean
  placeId: number | null
  placeCategory: PlaceCategory | null
  actionButton: ReactNode
  readOnly: boolean
  open: (
    placeId: number,
    placeCategory: PlaceCategory,
    options?: OpenOptions,
  ) => void
  close: () => void
}

export const usePlaceDetailSheetStore = create<PlaceDetailSheetState>((set) => ({
  isOpen: false,
  placeId: null,
  placeCategory: null,
  actionButton: null,
  readOnly: false,
  open: (placeId, placeCategory, options) =>
    set({
      isOpen: true,
      placeId,
      placeCategory,
      actionButton: options?.actionButton ?? null,
      readOnly: options?.readOnly ?? false,
    }),
  close: () =>
    set({
      isOpen: false,
      placeId: null,
      placeCategory: null,
      actionButton: null,
      readOnly: false,
    }),
}))
