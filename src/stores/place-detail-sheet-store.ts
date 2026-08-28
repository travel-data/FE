import { create } from 'zustand'
import type { ReactNode } from 'react'
import type { PlaceCategory } from '@/types/place'

interface PlaceDetailSheetState {
  isOpen: boolean
  placeId: number | null
  placeCategory: PlaceCategory | null
  actionButton: ReactNode
  open: (placeId: number, placeCategory: PlaceCategory, actionButton?: ReactNode) => void
  close: () => void
}

export const usePlaceDetailSheetStore = create<PlaceDetailSheetState>((set) => ({
  isOpen: false,
  placeId: null,
  placeCategory: null,
  actionButton: null,
  open: (placeId, placeCategory, actionButton = null) =>
    set({ isOpen: true, placeId, placeCategory, actionButton }),
  close: () => set({ isOpen: false, placeId: null, placeCategory: null, actionButton: null }),
}))
