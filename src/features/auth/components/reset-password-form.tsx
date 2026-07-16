"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

type FormValues = {
  password: string;
  confirmPassword: string;
};

const buildResetPasswordSchema = (t: (key: string) => string) =>
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

// ─── Inner component — contains useSearchParams, must be wrapped in Suspense ──
function ResetPasswordFormInner() {
  const t = useTranslations("resetPassword");
  const validationT = useTranslations("validation");
  const locale = useLocale() as InputLocale & ButtonLocale;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const urlCode = searchParams.get("code");
  const urlEmail = searchParams.get("email");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("reset_token");
      if (!token && !urlCode) {
        router.replace("/forgot-password");
      }
    }
  }, [router, urlCode]);

  const schema = buildResetPasswordSchema(validationT);

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const token =
      typeof window !== "undefined"
        ? (sessionStorage.getItem("reset_token") ?? "")
        : "";

    const email =
      urlEmail ||
      (typeof window !== "undefined"
        ? sessionStorage.getItem("reset_email")
        : "");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          token,
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const json = await response.json();

      if (response.ok && json.status) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("reset_email");
          sessionStorage.removeItem("reset_token");
          sessionStorage.removeItem("otp_resend_until");
        }
        toast(t("success"), "success");
        router.push("/login");
        return;
      }

      if (
        json.message?.toLowerCase().includes("same") ||
        json.message?.toLowerCase().includes("differ")
      ) {
        setError("password", { message: t("diffFromOld") });
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
          label={t("password")}
          type="password"
          placeholder="••••••••"
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
          {t("needHelp")}{" "}
          <Link
            href="/contact"
            className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            {t("contact")}
          </Link>
        </p>
      </form>
    </div>
  );
}

// ─── Exported wrapper — useSearchParams requires a Suspense boundary in Next.js App Router ──
export function ResetPasswordForm() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
