import { z } from 'zod'
import { emailField, passwordField } from '@/shared/validation/authFields'

export const loginSchema = z.object({
  email: emailField,
  password: passwordField(),
})

export type LoginFormData = z.infer<typeof loginSchema>
