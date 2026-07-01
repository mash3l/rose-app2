"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useToast } from "@/shared/ui/ToastProvider";
import { Button, type ButtonLocale } from "@/shared/ui/Button";
import { OtpInput } from "@/shared/ui/OtpInput";
import { Link, useRouter } from "@/i18n/routing";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://rose-app.elevate-bootcamp.cloud";

const RESEND_COOLDOWN_SECONDS = 60;
const OTP_LENGTH = 6;
const RESEND_UNTIL_KEY = "otp_resend_until";

function getRemainingCooldown(): number {
  if (typeof window === "undefined") return 0;
  const until = localStorage.getItem(RESEND_UNTIL_KEY);
  if (!until) return 0;
  return Math.max(0, Math.ceil((Number(until) - Date.now()) / 1000));
}

function startCooldown(): void {
  const until = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
  localStorage.setItem(RESEND_UNTIL_KEY, String(until));
}

function clearCooldown(): void {
  localStorage.removeItem(RESEND_UNTIL_KEY);
}

// ─── Inner component — contains useSearchParams, must be wrapped in Suspense ──
function OtpCodeFormInner() {
  const t = useTranslations("otpCode");
  const validationT = useTranslations("validation");

  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  // lazy initializer — computed once on first render, not inside an effect
  const [countdown, setCountdown] = useState<number>(getRemainingCooldown);

  const locale = useLocale() as ButtonLocale;
  const { toast } = useToast();

  const urlEmail = searchParams.get("email");
  const email =
    urlEmail ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem("reset_email")
      : "") ||
    "";

  const maskedEmail = email.replace(
    /^(.)(.*)(@.*)$/,
    (_, first, middle, domain) =>
      first + "*".repeat(Math.min(middle.length, 4)) + domain,
  );

  const isResendDisabled = countdown > 0 || isResending;
  const isOtpComplete = otp.length === OTP_LENGTH;

  useEffect(() => {
    if (typeof window !== "undefined" && !email) {
      router.replace("/forgot-password");
    }
  }, [router, email]);

  useEffect(() => {
    if (countdown <= 0) return;
    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          clearCooldown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdown]);

  // sync countdown across other open tabs on the same page
  useEffect(() => {
    function handleStorageChange(e: StorageEvent): void {
      if (e.key === RESEND_UNTIL_KEY) {
        setCountdown(getRemainingCooldown());
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  function handleOtpChange(value: string): void {
    setOtp(value);
    setError(null);
  }

  async function handleSubmit(): Promise<void> {
    if (!isOtpComplete) {
      setError(validationT("requiredField"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/verify-reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        },
      );

      const json = await response.json();

      if (response.ok && json.status) {
        toast(t("success"), "success");
        router.push(
          `/reset-password?email=${encodeURIComponent(email)}&code=${otp}`,
        );
        return;
      }

      const isExpired = response.status === 410;
      setError(isExpired ? t("expiredCode") : t("invalidCode"));
      setOtp("");
    } catch {
      toast(validationT("networkError"), "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend(): Promise<void> {
    if (isResendDisabled) return;

    setIsResending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await response.json();

      if (response.ok && json.status) {
        if (json.payload) sessionStorage.setItem("reset_token", json.payload);
        startCooldown();
        setCountdown(RESEND_COOLDOWN_SECONDS);
        setOtp("");
        setError(null);
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
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("subtitle", { email: maskedEmail })}{" "}
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="font-bold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
          >
            {t("edit")}
          </button>
        </p>
      </div>

      <div className="flex flex-col gap-[10px]">
        <OtpInput
          length={OTP_LENGTH}
          value={otp}
          onChange={handleOtpChange}
          disabled={isSubmitting}
          isError={!!error}
        />

        {error && (
          <p
            role="alert"
            className="text-sm font-medium text-danger text-center"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResendDisabled}
            className="
              text-sm text-muted-foreground transition-colors
              hover:text-primary hover:underline
              disabled:opacity-50 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded
            "
          >
            {countdown > 0 ? t("resendTimer", { s: countdown }) : t("resend")}
          </button>
        </div>

        <Button
          type="button"
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
          disabled={!isOtpComplete}
          locale={locale}
          onClick={handleSubmit}
        >
          {t("verify")}
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
      </div>
    </div>
  );
}

// ─── Exported wrapper — useSearchParams requires a Suspense boundary in Next.js App Router ──
export function OtpCodeForm() {
  return (
    <Suspense fallback={null}>
      <OtpCodeFormInner />
    </Suspense>
  );
}
