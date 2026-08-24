import { z } from 'zod'
import {
  emailField,
  passwordField,
  repeatPasswordField,
  withMatchingPasswords,
} from '../../../shared/validation/authFields'

export const RegisterSchema = withMatchingPasswords(
  z.object({
    email: emailField,

    password: passwordField(),

    repeatPassword: repeatPasswordField,

    name: z
      .string()
      .min(1, "Введіть ім'я")
      .min(2, "Ім'я повинно містити мінімум 2 символи"),

    acceptedTerms: z
      .boolean()
      .refine((value) => value === true, {
        message: 'Потрібно прийняти умови та положення',
      }),

    findOrders: z.boolean(),

    subscribe: z.boolean(),
  }),
)

export type RegisterFormData = z.infer<typeof RegisterSchema>


export const confirmAccountSchema = z.object({
  code: z
    .string()
    .min(1, 'Введіть код')
    .regex(/^\d{6}$/, 'Код повинен містити 6 цифр'),
})

export type ConfirmAccountFormData = z.infer<typeof confirmAccountSchema>