import { z } from 'zod'

export const emailField = z
  .string()
  .min(1, 'Введіть E-mail')
  .email('Введіть коректний E-mail')

export const passwordField = (minLength = 8) =>
  z
    .string()
    .min(1, 'Введіть пароль')
    .min(minLength, `Пароль повинен містити мінімум ${minLength} символів`)

export const repeatPasswordField = z.string().min(1, 'Повторіть пароль')

export const withMatchingPasswords = <
  Schema extends z.ZodType<{ password: string; repeatPassword: string }>,
>(
  schema: Schema,
) =>
  schema.refine((data) => data.password === data.repeatPassword, {
    message: 'Паролі не співпадають',
    path: ['repeatPassword'],
  })
