import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

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

// role만 localStorage에 유지 → 게스트 상태가 새로고침에도 유지됨.
// (user는 쿠키+/api/auth/me로 재판정되므로 persist된 role은 초기 힌트로만 쓰인다)
export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      // 게스트 role만 유지. user는 쿠키+/api/auth/me로 재판정되므로
      // persist하면 로그아웃/쿠키 삭제 후에도 user 잔재가 남아 오판정된다.
      partialize: (state) => ({
        role: state.role === 'guest' ? state.role : null,
      }),
    },
  ),
)

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
