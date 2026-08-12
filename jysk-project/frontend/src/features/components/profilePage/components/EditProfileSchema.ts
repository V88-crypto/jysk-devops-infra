import { z } from 'zod';

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(30, "Максимум 30 символів"),

  lastName: z
    .string()
    .min(2, "Прізвище повинно містити мінімум 2 символи")
    .max(30, "Максимум 30 символів"),

  email: z
    .email("Некоректна електронна пошта"),

  phone: z
    .string()
    .regex(
      /^\+?[0-9]{10,15}$/,
      "Некоректний номер телефону"
    ),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;