import { create } from 'zustand'
import { persist } from 'zustand/middleware'
type AuthRole = 'user' | 'guest' | null

interface AuthStoreState {
  role: AuthRole
  logout: () => void
  setAuthRole: (role: AuthRole) => void
}

export const useAuthStore = create(
  persist<AuthStoreState>(
    (set) => ({
      role: null,
      logout: () =>
        set(() => ({
          role: null,
        })),
      setAuthRole: (role) =>
        set(() => ({
          role: role,
        })),
    }),
    {
      name: 'authRole',
    },
  ),
)

export const useAuth = () => {
  const role = useAuthStore((state) => state.role)

  return {
    role,
    isLoggedIn: role === 'user',
    isGuest: role === 'guest',
  }
}
