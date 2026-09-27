import { z } from 'zod';

export const editProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Ім'я повинно містити мінімум 2 символи")
    .max(30, "Максимум 30 символів"),

  lastName: z
    .string()
    .trim()
    .min(2, "Прізвище повинно містити мінімум 2 символи")
    .max(30, "Максимум 30 символів"),

  phone: z.union([
    z.literal(''),
    z
      .string()
      .regex(
        /^\+?[0-9]{10,15}$/,
        "Некоректний номер телефону"
      ),
  ]),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
