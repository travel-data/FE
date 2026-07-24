import { create } from 'zustand'

type AuthRole = 'user' | 'guest' | null

interface AuthStoreState {
  role: AuthRole
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  setAuthRole: (role: AuthRole) => void
  setAuthenticated: (value: boolean) => void
  setLoading: (value: boolean) => void
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  role: null,
  isAuthenticated: false,
  isLoading: true,
  logout: () =>
    set(() => ({
      role: null,
      isAuthenticated: false,
    })),
  setAuthRole: (role) =>
    set(() => ({
      role,
    })),
  setAuthenticated: (value) =>
    set(() => ({
      isAuthenticated: value,
    })),
  setLoading: (value) =>
    set(() => ({
      isLoading: value,
    })),
}))

export const useAuth = () => {
  const role = useAuthStore((state) => state.role)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isLoading = useAuthStore((state) => state.isLoading)

  return {
    role,
    isAuthenticated,
    isLoading,
    isLoggedIn: role === 'user',
    isGuest: role === 'guest',
  }
}
