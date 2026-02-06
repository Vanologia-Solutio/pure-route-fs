import { LoginDto, RegisterDto } from '@/shared/dtos/auth'
import { ApiResponse } from '@/shared/helpers/api-response'

export class AuthService {
  async login(payload: LoginDto): Promise<ApiResponse<{ token: string }>> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return await res.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unknown error occurred')
    }
  }

  async register(payload: RegisterDto): Promise<ApiResponse<{ id: string }>> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      return await res.json()
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error('An unknown error occurred')
    }
  }
}

export const authService = new AuthService()
