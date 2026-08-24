import { apiRequest } from './httpClient'
import { tokenStorage } from '../auth/tokenStorage'

export interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role_id: number
  created_at: string
}

interface AuthTokenResponse {
  access_token: string
  token_type: string
}

interface RegisterResponse extends AuthTokenResponse {
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export const authService = {
  async login(payload: LoginPayload): Promise<AuthTokenResponse> {
    const response = await apiRequest<AuthTokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    tokenStorage.set(response.access_token)

    return response
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await apiRequest<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        password: payload.password,
        phone: payload.phone,
      }),
    })

    tokenStorage.set(response.access_token)

    return response
  },
}
