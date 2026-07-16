"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useToast } from "@/shared/ui/ToastProvider";
import { Input, type InputLocale } from "@/shared/ui/Input";
import { Button, type ButtonLocale } from "@/shared/ui/Button";
import { API_BASE_URL } from "@/shared/lib/env";
import type { UserInfoValues } from "./register-user-info-step";

const buildPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
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

type PasswordFormValues = z.infer<ReturnType<typeof buildPasswordSchema>>;

interface RegisterPasswordStepProps {
  email: string;
  userInfo: UserInfoValues;
}

export function RegisterPasswordStep({
  email,
  userInfo,
}: RegisterPasswordStepProps) {
  const t = useTranslations("register");
  const validationT = useTranslations("validation");
  const router = useRouter();
  const locale = useLocale() as InputLocale & ButtonLocale;

  const [globalError, setGlobalError] = useState<string | null>(null);

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(buildPasswordSchema(validationT)),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<PasswordFormValues> = async ({
    password,
    confirmPassword,
  }) => {
    setGlobalError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userInfo, email, password, confirmPassword }),
      });

      const json = await response.json();

      if (response.ok && json.status) {
        toast(t("success"), "success");
        router.push("/login");
        return;
      }

      setGlobalError(validationT("networkError"));
    } catch {
      setGlobalError(validationT("networkError"));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-1.5"
      noValidate
    >
      <Input
        label={t("password")}
        type="password"
        placeholder={t("passwordPlaceholder")}
        autoComplete="new-password"
        locale={locale}
        {...register("password")}
        error={errors.password?.message}
      />

      <Input
        label={t("confirmPassword")}
        type="password"
        placeholder={t("confirmPasswordPlaceholder")}
        autoComplete="new-password"
        locale={locale}
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      {globalError && (
        <p role="alert" className="text-sm font-medium text-danger text-center">
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
    </form>
  );
}
