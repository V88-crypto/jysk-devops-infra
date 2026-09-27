import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authService } from "../../../../shared/api/authService";
import { ApiError } from "../../../../shared/api/httpClient";
import { profileApi } from "../data/profileApi";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "./ChangePasswordSchema";

const inputClass = (hasError: boolean) =>
  `w-full h-[48px] px-[16px] rounded-[4px] border bg-[#e4e4e4] outline-none transition ${
    hasError
      ? "border-red-500"
      : "border-[#c5c5c5] focus:border-[#00b5bd]"
  }`;

const toErrorMessage = (error: unknown) => {
  if (error instanceof ApiError && error.status === 400) {
    return "Невірний поточний пароль";
  }

  return error instanceof ApiError
    ? error.message
    : "Не вдалося змінити пароль. Спробуйте ще раз.";
};

export const ChangePasswordForm = ({ email }: { email: string }) => {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSubmitError(null);
    setIsChanged(false);

    try {
      await profileApi.changePassword(data.currentPassword, data.password);
    } catch (error) {
      setSubmitError(toErrorMessage(error));
      return;
    }

    // The backend revokes every refresh token after a password change,
    // so log in again to keep this device's session alive.
    await authService
      .login({ email, password: data.password })
      .catch(() => undefined);

    reset();
    setIsChanged(true);
  };

  return (
    <section className="w-full max-w-[500px] mx-auto mb-[60px] px-4 sm:px-0">
      <h2 className="text-[26px] font-bold text-center mb-[25px]">
        Зміна пароля
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[15px]"
      >
        <div>
          <input
            type="password"
            placeholder="Поточний пароль"
            autoComplete="current-password"
            {...register("currentPassword")}
            className={inputClass(Boolean(errors.currentPassword))}
          />
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Новий пароль"
            autoComplete="new-password"
            {...register("password")}
            className={inputClass(Boolean(errors.password))}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Повторіть новий пароль"
            autoComplete="new-password"
            {...register("repeatPassword")}
            className={inputClass(Boolean(errors.repeatPassword))}
          />
          {errors.repeatPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.repeatPassword.message}
            </p>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-red-500">{submitError}</p>
        )}

        {isChanged && (
          <p className="text-sm font-semibold text-[#22aa00]">
            Пароль успішно змінено
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[42px] rounded-[4px] bg-[#00adb5] text-white font-semibold hover:bg-[#009da5] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "ЗБЕРЕЖЕННЯ..." : "ЗМІНИТИ ПАРОЛЬ"}
        </button>
      </form>
    </section>
  );
};
