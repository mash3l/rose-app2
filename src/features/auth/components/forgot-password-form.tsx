"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { useToast } from "@/shared/ui/ToastProvider";
import { Input, type InputLocale } from "@/shared/ui/Input";
import { Button, type ButtonLocale } from "@/shared/ui/Button";
import { Link, useRouter } from "@/i18n/routing";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://rose-app.elevate-bootcamp.cloud";

type FormValues = { email: string };

const buildForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("invalidEmail")),
  });

export function ForgotPasswordForm() {
  const t = useTranslations("forgotPassword");
  const validationT = useTranslations("validation");
  const locale = useLocale() as InputLocale & ButtonLocale;
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(buildForgotPasswordSchema(validationT)),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const json = await response.json();

      if (response.ok && json.status) {
        toast(t("success"), "success");
        router.push(`/otp-code?email=${encodeURIComponent(data.email)}`);
        return;
      }

      if (response.status === 404) {
        setError("email", { message: t("noAccountFound") });
        return;
      }

      toast(validationT("networkError"), "error");
    } catch {
      toast(validationT("networkError"), "error");
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        <div className="w-full h-px bg-border mt-2" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[10px]"
        noValidate
      >
        <Input
          label={t("email")}
          type="email"
          placeholder="user@example.com"
          autoComplete="email"
          locale={locale}
          {...register("email")}
          error={errors.email?.message}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
          locale={locale}
        >
          {t("continue")}
        </Button>

        <div className="w-full h-px bg-border" />

        <p className="text-sm text-muted-foreground text-center">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            {t("register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
