import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Введіть E-mail')
    .email('Введіть коректний E-mail'),
})

export type ForgotPasswordFormData = z.infer<
  typeof forgotPasswordSchema
>


export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Введіть пароль')
      .min(8, 'Пароль повинен містити мінімум 8 символів'),

    repeatPassword: z
      .string()
      .min(1, 'Повторіть пароль'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Паролі не співпадають',
    path: ['repeatPassword'],
  })

export type ResetPasswordFormData = z.infer<
  typeof resetPasswordSchema
>