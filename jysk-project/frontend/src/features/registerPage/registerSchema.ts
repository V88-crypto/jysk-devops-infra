import { z } from 'zod'

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Введіть E-mail')
      .email('Введіть коректний E-mail'),

    password: z
      .string()
      .min(8, 'Пароль повинен містити мінімум 8 символів'),

    repeatPassword: z
      .string()
      .min(1, 'Повторіть пароль'),

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
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Паролі не співпадають',
    path: ['repeatPassword'],
  })

export type RegisterFormData = z.infer<typeof RegisterSchema>


export const confirmAccountSchema = z.object({
  code: z
    .string()
    .min(1, 'Введіть код')
    .regex(/^\d{6}$/, 'Код повинен містити 6 цифр'),
})

export type ConfirmAccountFormData = z.infer<typeof confirmAccountSchema>