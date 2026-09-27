import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import type { AuthUser } from "../../../../shared/api/authService";
import { ApiError } from "../../../../shared/api/httpClient";
import { useAuth } from "../../../../shared/auth/useAuth";
import { profileApi } from "../data/profileApi";
import {
  editProfileSchema,
  type EditProfileFormData,
} from "./EditProfileSchema";

const inputClass = (hasError: boolean) =>
  `w-full h-[48px] px-[16px] rounded-[4px] border bg-[#e4e4e4] outline-none transition ${
    hasError
      ? "border-red-500"
      : "border-[#c5c5c5] focus:border-[#00b5bd]"
  }`;

const EditProfileFields = ({ user }: { user: AuthUser }) => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone ?? "",
    },
  });

  const onSubmit = async (data: EditProfileFormData) => {
    setSubmitError(null);

    try {
      const updatedUser = await profileApi.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
      });
      updateUser(updatedUser);
      navigate("/profile");
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Не вдалося зберегти зміни. Спробуйте ще раз.",
      );
    }
  };

  return (
    <section className="w-full max-w-[500px] mx-auto mt-[40px] mb-[60px] px-4 sm:px-0">
      <h2 className="text-[30px] font-bold text-center mb-[30px]">
        Редагування профілю
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[15px]"
      >
        <div>
          <input
            type="text"
            placeholder="Ім'я"
            {...register("firstName")}
            className={inputClass(Boolean(errors.firstName))}
          />

          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Прізвище"
            {...register("lastName")}
            className={inputClass(Boolean(errors.lastName))}
          />

          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="email"
            value={user.email}
            readOnly
            aria-readonly="true"
            className={`${inputClass(false)} cursor-not-allowed text-[#777]`}
          />
          <p className="mt-1 text-sm text-[#888]">
            Електронну пошту змінити не можна
          </p>
        </div>

        <div>
          <input
            type="tel"
            placeholder="Номер телефону (необов'язково)"
            {...register("phone")}
            className={inputClass(Boolean(errors.phone))}
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-red-500">{submitError}</p>
        )}

        <div className="flex gap-[12px] mt-[10px]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-[42px] rounded-[4px] bg-[#00adb5] text-white font-semibold hover:bg-[#009da5] transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "ЗБЕРЕЖЕННЯ..." : "ЗБЕРЕГТИ"}
          </button>

          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 h-[42px] rounded-[4px] bg-[#10b7bf] text-white font-semibold hover:bg-[#009da5] transition"
          >
            СКАСУВАТИ
          </button>
        </div>

        <button
          type="button"
          className="h-[42px] rounded-[4px] bg-[#F74D4D] text-white font-semibold hover:bg-[#e53b3b] transition"
        >
          ВИДАЛИТИ АКАУНТ
        </button>
      </form>
    </section>
  );
};

export const EditProfileForm = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="w-full flex justify-center items-center py-[100px]">
        Завантаження...
      </div>
    );
  }

  return <EditProfileFields key={user.id} user={user} />;
};
