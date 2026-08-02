import '@tanstack/react-router'

declare module '@tanstack/react-router' {
  interface HistoryState {
    shareSuccess?: boolean
    shareEditSuccess?: boolean
  }
}
