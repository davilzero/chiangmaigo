import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  role: 'customer' | 'merchant' | 'admin'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        // TODO: Implement actual login API call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        
        if (!response.ok) {
          throw new Error('Login failed')
        }
        
        const data = await response.json()
        set({
          user: data.user,
          token: data.token,
          isAuthenticated: true,
        })
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
      
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },
      
      setToken: (token: string | null) => {
        set({ token })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)

