"use client";

import { useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 60;

function getRemainingCooldown(storageKey: string): number {
  if (typeof window === "undefined") return 0;
  const until = localStorage.getItem(storageKey);
  if (!until) return 0;
  return Math.max(0, Math.ceil((Number(until) - Date.now()) / 1000));
}

export function useOtpResendCooldown(storageKey: string) {
  const [countdown, setCountdown] = useState<number>(() =>
    getRemainingCooldown(storageKey),
  );

  useEffect(() => {
    if (countdown <= 0) return;
    const intervalId = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdown]);

  function startCooldown(): void {
    const until = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
    localStorage.setItem(storageKey, String(until));
    setCountdown(RESEND_COOLDOWN_SECONDS);
  }

  return { countdown, isCoolingDown: countdown > 0, startCooldown };
}
