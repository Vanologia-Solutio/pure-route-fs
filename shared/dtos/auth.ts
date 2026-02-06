export interface LoginDto {
  username: string
  password: string
}

export interface RegisterDto {
  name: string
  username: string
  email?: string
  password: string
}
