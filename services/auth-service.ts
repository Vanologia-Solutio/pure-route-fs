import { LoginDto, RegisterDto } from '@/shared/dtos/auth'
import { ApiResponse } from '@/shared/helpers/api-response'

export class AuthService {
  async login(payload: LoginDto): Promise<ApiResponse<{ token: string }>> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }

  async register(payload: RegisterDto): Promise<ApiResponse<{ id: string }>> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message)
    }
    return res.json()
  }
}

export const authService = new AuthService()
