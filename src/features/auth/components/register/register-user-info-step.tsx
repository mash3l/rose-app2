"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Input, type InputLocale } from "@/shared/ui/Input";
import { Button, type ButtonLocale } from "@/shared/ui/Button";
import { Select } from "@/shared/ui/Select";

const USERNAME_PATTERN = /^[A-Za-z0-9_]+$/;

const buildUserInfoSchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(1, t("requiredField")),
    lastName: z.string().min(1, t("requiredField")),
    username: z
      .string()
      .min(1, t("requiredField"))
      .regex(USERNAME_PATTERN, t("usernameInvalid")),
    phone: z.string().min(1, t("requiredField")),
    gender: z.enum(["MALE", "FEMALE"], { message: t("requiredField") }),
  });

export type UserInfoValues = z.infer<ReturnType<typeof buildUserInfoSchema>>;

interface RegisterUserInfoStepProps {
  defaultValues: UserInfoValues | null;
  onSubmitted: (values: UserInfoValues) => void;
}

export function RegisterUserInfoStep({
  defaultValues,
  onSubmitted,
}: RegisterUserInfoStepProps) {
  const t = useTranslations("register");
  const validationT = useTranslations("validation");
  const locale = useLocale() as InputLocale & ButtonLocale;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoValues>({
    resolver: zodResolver(buildUserInfoSchema(validationT)),
    defaultValues: defaultValues ?? {
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
      gender: undefined,
    },
  });

  const onSubmit: SubmitHandler<UserInfoValues> = (values) => {
    onSubmitted(values);
  };

  const genderOptions = [
    { value: "MALE", label: t("male") },
    { value: "FEMALE", label: t("female") },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-1.5"
      noValidate
    >
      <div className="grid grid-cols-2 gap-5">
        <Input
          label={t("firstName")}
          placeholder={t("firstNamePlaceholder")}
          autoComplete="given-name"
          locale={locale}
          {...register("firstName")}
          error={errors.firstName?.message}
        />
        <Input
          label={t("lastName")}
          placeholder={t("lastNamePlaceholder")}
          autoComplete="family-name"
          locale={locale}
          {...register("lastName")}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label={t("username")}
        placeholder={t("usernamePlaceholder")}
        autoComplete="username"
        locale={locale}
        {...register("username")}
        error={errors.username?.message}
      />

      <Input
        label={t("phone")}
        type="tel"
        placeholder={t("phonePlaceholder")}
        autoComplete="tel"
        locale={locale}
        {...register("phone")}
        error={errors.phone?.message}
      />

      <Select
        label={t("gender")}
        locale={locale}
        placeholder={t("selectGender")}
        {...register("gender")}
        error={!!errors.gender?.message}
        errorMessage={errors.gender?.message}
      >
        {genderOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        locale={locale}
      >
        {t("next")}
      </Button>
    </form>
  );
}
