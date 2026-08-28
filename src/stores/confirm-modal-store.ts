import { create } from 'zustand'
import type { ReactNode } from 'react'

interface ConfirmModalConfig {
  title: string
  description: ReactNode
  cancelLabel?: string
  actionLabel: string
  onCancel?: () => void
  onAction: () => void
}

interface ConfirmModalState extends ConfirmModalConfig {
  isOpen: boolean
  open: (config: ConfirmModalConfig) => void
  close: () => void
}

const DEFAULT_CONFIG: ConfirmModalConfig = {
  title: '',
  description: '',
  actionLabel: '',
  onAction: () => {},
}

export const useConfirmModalStore = create<ConfirmModalState>((set) => ({
  isOpen: false,
  ...DEFAULT_CONFIG,
  open: (config) => set({ isOpen: true, ...config }),
  close: () => set({ isOpen: false, ...DEFAULT_CONFIG }),
}))
