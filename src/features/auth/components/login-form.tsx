"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { signIn } from "next-auth/react";

import { Input, type InputLocale } from "@/shared/ui/Input";
import { Button, type ButtonLocale } from "@/shared/ui/Button";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Link, useRouter } from "@/i18n/routing";

const buildLoginSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(1, t("requiredField")),
    password: z.string().min(1, t("requiredField")),
    rememberMe: z.boolean(),
  });

type LoginFormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export function LoginForm() {
  const t = useTranslations("login");
  const validationT = useTranslations("validation");
  const router = useRouter();
  const locale = useLocale() as InputLocale & ButtonLocale;

  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(buildLoginSchema(validationT)),
    defaultValues: { username: "", password: "", rememberMe: false },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setGlobalError(null);
    const result = await signIn("credentials", {
      redirect: false,
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      setGlobalError(t("invalidCredentials"));
      return;
    }

    if (result?.ok) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Title - Edwardian Script ITC, primary color, centered */}
      <h1
        className="text-[48px] leading-none font-normal text-primary text-center"
        style={{ fontFamily: "var(--font-edwardian)" }}
      >
        {t("title")}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          label={t("username")}
          type="text"
          placeholder="johndoe"
          autoComplete="username"
          locale={locale}
          {...register("username")}
          error={errors.username?.message}
        />

        <Input
          label={t("password")}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          locale={locale}
          {...register("password")}
          error={errors.password?.message}
        />

        {/* Forgot password - end-aligned, flips in RTL */}
        <div className="flex justify-end -mt-1">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            {t("forgotPassword")}
          </Link>
        </div>

        <Checkbox
          id="rememberMe"
          label={t("rememberMe")}
          {...register("rememberMe")}
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
          className="w-full mt-2"
          isLoading={isSubmitting}
          locale={locale}
        >
          {t("button")}
        </Button>

        <div className="w-full h-px bg-border mt-2" />

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
