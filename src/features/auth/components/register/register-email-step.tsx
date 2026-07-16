"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Input, type InputLocale } from "@/shared/ui/Input";
import { Button, type ButtonLocale } from "@/shared/ui/Button";
import { Link } from "@/i18n/routing";
import { API_BASE_URL } from "@/shared/lib/env";

const buildEmailSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("invalidEmail")),
  });

type EmailFormValues = { email: string };

interface RegisterEmailStepProps {
  defaultEmail: string;
  onSubmitted: (email: string) => void;
}

export function RegisterEmailStep({
  defaultEmail,
  onSubmitted,
}: RegisterEmailStepProps) {
  const t = useTranslations("register");
  const validationT = useTranslations("validation");
  const locale = useLocale() as InputLocale & ButtonLocale;

  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(buildEmailSchema(validationT)),
    defaultValues: { email: defaultEmail },
  });

  const onSubmit: SubmitHandler<EmailFormValues> = async ({ email }) => {
    setGlobalError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/send-email-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const json = await response.json();

      if (response.ok && json.status) {
        onSubmitted(email);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5.5"
      noValidate
    >
      <Input
        label={t("email")}
        type="email"
        placeholder={t("emailPlaceholder")}
        autoComplete="email"
        locale={locale}
        {...register("email")}
        error={errors.email?.message}
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
        {t("next")}
      </Button>

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
  );
}
