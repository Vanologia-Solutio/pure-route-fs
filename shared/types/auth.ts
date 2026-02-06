export interface AuthState {
  token: string | null
  user: ClientToken | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
}

export interface ClientToken {
  sub: number
  name: string
  username: string
  email: string
  attrs: {
    role: string
  }
  perms: string[]
}

export interface DecodedToken extends ClientToken {
  exp: number
  iat: number
  iss: string
}
