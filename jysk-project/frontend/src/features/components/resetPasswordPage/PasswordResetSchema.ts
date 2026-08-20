import { z } from 'zod'
import {
  emailField,
  passwordField,
  repeatPasswordField,
  withMatchingPasswords,
} from '../../../shared/validation/authFields'

export const forgotPasswordSchema = z.object({
  email: emailField,
})

export type ForgotPasswordFormData = z.infer<
  typeof forgotPasswordSchema
>


export const resetPasswordSchema = withMatchingPasswords(
  z.object({
    password: passwordField(),

    repeatPassword: repeatPasswordField,
  }),
)

export type ResetPasswordFormData = z.infer<
  typeof resetPasswordSchema
>