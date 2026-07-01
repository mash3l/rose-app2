"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { useToast } from "@/shared/ui/ToastProvider";

import { Input, type InputLocale } from "@/shared/ui/Input";
import { Button, type ButtonLocale } from "@/shared/ui/Button";
import { Select } from "@/shared/ui/Select";
import { Link, useRouter } from "@/i18n/routing";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://rose-app.elevate-bootcamp.cloud";

const buildRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z.string().min(1, t("requiredField")),
      lastName: z.string().min(1, t("requiredField")),
      username: z.string().min(1, t("requiredField")),
      email: z.string().email(t("invalidEmail")),
      phone: z.string().min(1, t("requiredField")),
      gender: z.enum(["MALE", "FEMALE"], {
        message: t("requiredField"),
      }),
      password: z
        .string()
        .min(8, t("passwordWeak"))
        .regex(/[A-Z]/, t("passwordWeak"))
        .regex(/[a-z]/, t("passwordWeak"))
        .regex(/[0-9]/, t("passwordWeak"))
        .regex(/[^A-Za-z0-9]/, t("passwordWeak")),
      confirmPassword: z.string().min(1, t("requiredField")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMatch"),
      path: ["confirmPassword"],
    });

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  gender: "MALE" | "FEMALE";
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const t = useTranslations("register");
  const validationT = useTranslations("validation");
  const router = useRouter();
  const locale = useLocale() as InputLocale & ButtonLocale;
  const { toast } = useToast();

  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(buildRegisterSchema(validationT)),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      gender: undefined,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setGlobalError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
        }),
      });

      const json = await response.json();

      if (response.ok && json.status) {
        toast(t("success"), "success");
        router.push("/login");
        return;
      }

      if (
        response.status === 409 ||
        json.message?.toLowerCase().includes("email")
      ) {
        setError("email", { message: t("emailInUse") });
        return;
      }

      setGlobalError(validationT("networkError"));
    } catch {
      setGlobalError(validationT("networkError"));
    }
  };

  const genderOptions = [
    { value: "MALE", label: t("male") },
    { value: "FEMALE", label: t("female") },
  ];

  return (
    <div className="flex w-full flex-col gap-4 [@media(max-height:780px)]:gap-3 [@media(max-height:640px)]:gap-2">
      <h1
        className="
          text-[36px] leading-none font-normal text-primary text-center
          [@media(max-height:780px)]:text-[28px]
          [@media(max-height:640px)]:text-[22px]
        "
        style={{ fontFamily: "var(--font-edwardian)" }}
      >
        {t("title")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[6px]"
        noValidate
      >
        <div className="grid grid-cols-2 gap-5">
          <Input
            label={t("firstName")}
            placeholder="Jonathan"
            autoComplete="given-name"
            locale={locale}
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label={t("lastName")}
            placeholder="Adrian"
            autoComplete="family-name"
            locale={locale}
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          label={t("username")}
          placeholder="johndoe"
          autoComplete="username"
          locale={locale}
          {...register("username")}
          error={errors.username?.message}
        />

        <Input
          label={t("email")}
          type="email"
          placeholder="user@example.com"
          autoComplete="email"
          locale={locale}
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label={t("phone")}
          type="tel"
          placeholder="1012345678"
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

        <Input
          label={t("password")}
          type="password"
          placeholder="Password@12345"
          autoComplete="new-password"
          locale={locale}
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          label={t("confirmPassword")}
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          locale={locale}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {globalError && (
          <p
            role="alert"
            className="text-sm font-medium text-danger text-center"
          >
            {globalError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
          locale={locale}
        >
          {t("button")}
        </Button>

        <div className="w-full h-px bg-border" />

        <p className="text-sm text-muted-foreground text-center">
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            {t("login")}
          </Link>
        </p>
      </form>
    </div>
  );
}
