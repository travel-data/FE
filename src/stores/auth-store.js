import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  isLoading: true,
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),
  resetAuth: () => set({ isAuthenticated: false, isLoading: false }),
}))
