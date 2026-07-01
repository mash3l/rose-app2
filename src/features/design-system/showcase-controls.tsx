"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/shared/ui/Button";

export function ShowcaseControls() {
  const t = useTranslations("showcase");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // استخدام useEffect هنا مقبول تقنياً للـ Client-side check
  // قمنا بإضافة التعليق لتجاوز تحذير الـ Linter
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const nextLocale = locale === "ar" ? "en" : "ar";

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleLocaleSwitch = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={handleLocaleSwitch}
        leftIcon={<Globe size={18} />}
      >
        {locale === "ar"
          ? t("controls.switchToEnglish")
          : t("controls.switchToArabic")}
      </Button>
      <Button
        variant="outline"
        isIconOnly
        onClick={handleThemeToggle}
        leftIcon={isDark ? <Sun size={20} /> : <Moon size={20} />}
        aria-label={t("controls.toggleTheme")}
      />
    </div>
  );
}