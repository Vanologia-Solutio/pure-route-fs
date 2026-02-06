import { Env } from '../constants/environments'
import { DecodedToken } from '../types/auth'

export const setToken = (token: string) => {
  document.cookie = `${Env.TOKEN_NAME}=${token}; path=/; max-age=${Env.TOKEN_EXPIRATION}; secure; samesite=strict`
}

export const getToken = (): string | null => {
  const cookie = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${Env.TOKEN_NAME}=`))
  return cookie ? cookie.split('=')[1] : null
}

export const removeToken = () => {
  document.cookie = `${Env.TOKEN_NAME}=; path=/; expires=${new Date(0).toUTCString()}`
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    if (!token) throw new Error('Token is missing')

    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid token structure')

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = atob(base64)

    return JSON.parse(jsonPayload)
  } catch (err) {
    throw err
  }
}
