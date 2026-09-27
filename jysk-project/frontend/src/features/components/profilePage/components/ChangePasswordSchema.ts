import { z } from 'zod';

import {
  passwordField,
  repeatPasswordField,
  withMatchingPasswords,
} from '../../../../shared/validation/authFields';

export const changePasswordSchema = withMatchingPasswords(
  z.object({
    currentPassword: z.string().min(1, 'Введіть поточний пароль'),
    password: passwordField().max(72, 'Пароль може містити максимум 72 символи'),
    repeatPassword: repeatPasswordField,
  }),
).refine((data) => data.password !== data.currentPassword, {
  message: 'Новий пароль має відрізнятися від поточного',
  path: ['password'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
