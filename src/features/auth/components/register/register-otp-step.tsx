"use client";

import { useId, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { useToast } from "@/shared/ui/ToastProvider";
import { Button, type ButtonLocale } from "@/shared/ui/Button";
import { OtpInput } from "@/shared/ui/OtpInput";
import { useOtpResendCooldown } from "@/shared/hooks/useOtpResendCooldown";
import { API_BASE_URL } from "@/shared/lib/env";

const OTP_LENGTH = 6;

const buildOtpSchema = (t: (key: string) => string) =>
  z.object({
    code: z
      .string()
      .min(1, t("requiredField"))
      .length(OTP_LENGTH, t("requiredField")),
  });

type OtpFormValues = z.infer<ReturnType<typeof buildOtpSchema>>;

interface RegisterOtpStepProps {
  email: string;
  onVerified: () => void;
  onEditEmail: () => void;
}

export function RegisterOtpStep({
  email,
  onVerified,
  onEditEmail,
}: RegisterOtpStepProps) {
  const t = useTranslations("register");
  const validationT = useTranslations("validation");
  const locale = useLocale() as ButtonLocale;

  const [isResending, setIsResending] = useState(false);

  const otpFieldId = useId();
  const otpErrorId = `${otpFieldId}-error`;

  const { toast } = useToast();
  const { countdown, isCoolingDown, startCooldown } = useOtpResendCooldown(
    "register_otp_resend_until",
  );

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(buildOtpSchema(validationT)),
    defaultValues: { code: "" },
  });

  const onSubmit: SubmitHandler<OtpFormValues> = async ({ code }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/confirm-email-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        },
      );

      const json = await response.json();

      if (response.ok && json.status) {
        onVerified();
        return;
      }

      const isExpired = response.status === 410;
      setError("code", {
        message: isExpired ? t("expiredCode") : t("invalidCode"),
      });
      setValue("code", "");
    } catch {
      toast(validationT("networkError"), "error");
    }
  };

  async function handleResend(): Promise<void> {
    if (isCoolingDown || isResending) return;

    setIsResending(true);
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
        startCooldown();
        setValue("code", "");
        clearErrors("code");
        toast(t("resendSuccess"), "success");
      } else {
        toast(validationT("networkError"), "error");
      }
    } catch {
      toast(validationT("networkError"), "error");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2.5"
      noValidate
    >
      <p className="text-sm text-muted-foreground">
        {t("otpSentTo", { email })}{" "}
        <button
          type="button"
          onClick={onEditEmail}
          className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
        >
          {t("edit")}
        </button>
      </p>

      <div className="flex justify-center">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <OtpInput
              id={otpFieldId}
              length={OTP_LENGTH}
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
              isError={!!errors.code}
              aria-invalid={!!errors.code}
              aria-describedby={errors.code ? otpErrorId : undefined}
              aria-label={t("otpLabel")}
            />
          )}
        />
      </div>

      {errors.code && (
        <p
          id={otpErrorId}
          role="alert"
          className="text-sm font-medium text-danger text-center"
        >
          {errors.code.message}
        </p>
      )}

      <button
        type="button"
        onClick={handleResend}
        disabled={isCoolingDown || isResending}
        className="
          self-end text-sm text-muted-foreground transition-colors
          hover:text-primary hover:underline
          disabled:opacity-50 disabled:cursor-not-allowed
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded
        "
      >
        {isCoolingDown ? t("resendTimer", { s: countdown }) : t("resend")}
      </button>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        isLoading={isSubmitting}
        locale={locale}
      >
        {t("verifyCode")}
      </Button>
    </form>
  );
}
