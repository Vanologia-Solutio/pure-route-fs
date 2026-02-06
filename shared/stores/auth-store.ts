import { authService } from '@/services/auth-service'
import { LoginDto, RegisterDto } from '@/shared/dtos/auth'
import { AuthState, ClientToken } from '@/shared/types/auth'
import {
  decodeToken,
  getToken,
  removeToken,
  setToken,
} from '@/shared/utils/token'
import { create } from 'zustand'
import { ApiResponse } from '../helpers/api-response'

interface AuthStore extends AuthState {
  isInitializing: boolean
  register: (payload: RegisterDto) => Promise<ApiResponse<{ id: string }>>
  signIn: (credential: LoginDto) => Promise<ApiResponse<{ token: string }>>
  signOut: () => void
  initialize: () => void
}

const generateUser = (token: string): ClientToken => {
  const decoded = decodeToken(token)!
  return {
    sub: decoded.sub,
    name: decoded.name || '',
    username: decoded.username || '',
    email: decoded.email || '',
    attrs: decoded.attrs,
    perms: decoded.perms,
  }
}

export const useAuthStore = create<AuthStore>(set => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitializing: true,

  register: async payload => {
    set({ isLoading: true, error: null })

    try {
      const res = await authService.register(payload)
      if (!res.success) {
        set({ error: new Error(res.message) })
        return res
      }

      return res
    } catch (err) {
      set({ error: err as Error })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  signIn: async credential => {
    set({ isLoading: true, error: null })

    try {
      const res = await authService.login(credential)
      if (!res.success) {
        set({ error: new Error(res.message) })
        return res
      }

      const { token } = res.data
      setToken(token)

      const user = generateUser(token)

      set({
        token,
        user,
        isAuthenticated: true,
      })

      return res
    } catch (err) {
      set({ error: err as Error })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: () => {
    removeToken()
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    })
  },

  initialize: () => {
    const token = getToken()

    if (!token) {
      set({ isInitializing: false })
      return
    }

    const user = generateUser(token)

    set({
      token,
      user,
      isAuthenticated: true,
      isInitializing: false,
    })
  },
}))
