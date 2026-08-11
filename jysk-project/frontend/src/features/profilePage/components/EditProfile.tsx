import { useForm } from "react-hook-form";
import { FormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  editProfileSchema,
  type EditProfileFormData,
} from "./EditProfileSchema";

export const EditProfileForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: EditProfileFormData) => {
    console.log("SUCCESS:", data);
  };

  const onError = (errors: FormState<EditProfileFormData>["errors"]) => {
    console.log("ERRORS:", errors);
  };

  console.log(errors);

  return (
    <section className="w-full max-w-[500px] mx-auto mt-[40px]">
      <h2 className="text-[30px] font-bold text-center mb-[30px]">
        Редагування профілю
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-[15px]"
      >
        <div>
          <input
            type="text"
            placeholder="Ім'я"
            {...register("firstName")}
            className={`w-full h-[48px] px-[16px] rounded-[4px] border bg-[#e4e4e4] outline-none transition ${
              errors.firstName
                ? "border-red-500"
                : "border-[#c5c5c5] focus:border-[#00b5bd]"
            }`}
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
            className={`w-full h-[48px] px-[16px] rounded-[4px] border bg-[#e4e4e4] outline-none transition ${
              errors.lastName
                ? "border-red-500"
                : "border-[#c5c5c5] focus:border-[#00b5bd]"
            }`}
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
            placeholder="Електронна пошта"
            {...register("email")}
            className={`w-full h-[48px] px-[16px] rounded-[4px] border bg-[#e4e4e4] outline-none transition ${
              errors.email
                ? "border-red-500"
                : "border-[#c5c5c5] focus:border-[#00b5bd]"
            }`}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Номер телефону"
            {...register("phone")}
            className={`w-full h-[48px] px-[16px] rounded-[4px] border bg-[#e4e4e4] outline-none transition ${
              errors.phone
                ? "border-red-500"
                : "border-[#c5c5c5] focus:border-[#00b5bd]"
            }`}
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="flex gap-[12px] mt-[10px]">
          <button
            type="submit"
            className="flex-1 h-[42px] rounded-[4px] bg-[#00adb5] text-white font-semibold hover:bg-[#009da5] transition"
          >
            ЗБЕРЕГТИ
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