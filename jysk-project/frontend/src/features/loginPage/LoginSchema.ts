import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Введіть E-mail')
    .email('Введіть коректний E-mail'),

  password: z
    .string()
    .min(1, 'Введіть пароль')
    .min(8, 'Пароль повинен містити мінімум 8 символів'),
})

export type LoginFormData = z.infer<typeof loginSchema>