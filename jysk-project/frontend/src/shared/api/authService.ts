import { ApiError, apiRequest } from './httpClient'
import { tokenStorage } from '@/shared/auth/tokenStorage'

export interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role_id: number
  role: string
  created_at: string
}

interface AuthTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

interface RegisterResponse extends AuthTokenResponse {
  user: AuthUser
}

interface MessageResponse {
  detail: string
}

interface ResetTokenValidResponse {
  valid: boolean
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

    tokenStorage.setTokens(response.access_token, response.refresh_token)

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

    tokenStorage.setTokens(response.access_token, response.refresh_token)

    return response
  },

  async logout(accessToken: string, refreshToken: string): Promise<void> {
    const revoke = (access: string, refresh: string) =>
      apiRequest<void>('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${access}` },
        body: JSON.stringify({ refresh_token: refresh }),
      })

    try {
      await revoke(accessToken, refreshToken)
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        throw error
      }

      const tokens = await apiRequest<AuthTokenResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
      await revoke(tokens.access_token, tokens.refresh_token)
    }
  },

  me(): Promise<AuthUser> {
    return apiRequest<AuthUser>('/auth/me')
  },

  forgotPassword(email: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  validateResetToken(token: string): Promise<ResetTokenValidResponse> {
    return apiRequest<ResetTokenValidResponse>(
      `/auth/reset-password/validate?token=${encodeURIComponent(token)}`,
    )
  },

  resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    return apiRequest<MessageResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    })
  },
}
