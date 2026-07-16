"use client";

import { Home, Gift, LayoutGrid, Sparkles, Phone, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

import { Link, usePathname } from "@/i18n/routing";

interface NavItem {
  href: string;
  labelKey:
    "home" | "products" | "categories" | "occasions" | "contact" | "about";
  icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/products", labelKey: "products", icon: Gift },
  { href: "/categories", labelKey: "categories", icon: LayoutGrid },
  { href: "/occasions", labelKey: "occasions", icon: Sparkles },
  { href: "/contact", labelKey: "contact", icon: Phone },
  { href: "/about", labelKey: "about", icon: Info },
];

export function SecondaryNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="hidden h-11 w-full items-center justify-center gap-2 bg-primary-light px-9 dark:bg-soft-pink-950 lg:flex">
      {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex items-center gap-1.5 px-2 py-1 text-body-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md",
              isActive
                ? "text-primary underline underline-offset-4"
                : "text-zinc-700 dark:text-zinc-200 hover:text-primary",
            ].join(" ")}
          >
            <Icon size={16} aria-hidden />
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
