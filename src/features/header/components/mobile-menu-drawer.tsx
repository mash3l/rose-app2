"use client";

import {
  Home,
  Gift,
  LayoutGrid,
  Sparkles,
  Phone,
  Info,
  Heart,
  ShoppingCart,
  User,
  X,
  Bell,
  MapPin,
  LogOut,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

import { Link, usePathname } from "@/i18n/routing";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

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

export interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  userName?: string;
  deliveryLocation?: string;
  cartCount?: number;
  notificationCount?: number;
}

export function MobileMenuDrawer({
  isOpen,
  onClose,
  isAuthenticated = false,
  userName = "User",
  deliveryLocation = "Cairo",
  cartCount = 0,
  notificationCount = 0,
}: MobileMenuDrawerProps) {
  const t = useTranslations("nav");
  const headerT = useTranslations("header");
  const pathname = usePathname();

  return (
    <div
      className={[
        "fixed inset-0 z-50 lg:hidden transition-[visibility] duration-300",
        isOpen ? "visible" : "invisible",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        aria-label={headerT("closeMenu")}
        onClick={onClose}
        className={[
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      <div
        className={[
          "absolute inset-y-0 start-0 flex w-[85%] max-w-[320px] flex-col gap-6 overflow-y-auto p-6",
          "transition-transform duration-300 ease-out",
          "bg-[#18181b] text-[#fafafa] dark:bg-white dark:text-[#18181b]",
          isOpen ? "translate-x-0" : "rtl:translate-x-full -translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between">
          <ThemeToggle />
          <button
            type="button"
            onClick={onClose}
            aria-label={headerT("closeMenu")}
            className="flex items-center justify-center rounded-md p-1 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:hover:text-primary"
          >
            <X size={22} aria-hidden />
          </button>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2 rounded-md bg-[#27272a] p-3 text-sm text-[#fafafa] dark:bg-gray-100 dark:text-[#18181b]">
            <MapPin size={18} className="text-[#ff85a2] dark:text-[#e11d48]" />
            <div className="flex flex-col">
              <span className="text-xs opacity-70">{headerT("deliverTo")}</span>
              <span className="font-medium">{deliveryLocation}</span>
            </div>
          </div>
        )}

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-body font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  isActive
                    ? "text-[#ff85a2] dark:text-[#e11d48]"
                    : "text-[#fafafa] dark:text-[#18181b]",
                ].join(" ")}
              >
                <Icon size={18} aria-hidden />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="h-px w-full bg-[#3f3f46] dark:bg-gray-200" />

        <div className="flex flex-col gap-1">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2.5 text-body font-medium text-[#ff85a2] dark:text-[#e11d48]">
                <User size={18} aria-hidden />
                {headerT("hello")}, {userName}
              </div>

              <Link
                href="/notifications"
                onClick={onClose}
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-body font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <div className="flex items-center gap-3">
                  <Bell size={18} aria-hidden />
                  {headerT("notifications")}
                </div>
                {notificationCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff85a2] px-1 text-xs text-white dark:bg-[#e11d48]">
                    {notificationCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-body font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <User size={18} aria-hidden />
              {headerT("login")}
            </Link>
          )}

          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-body font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Heart size={18} aria-hidden />
            {headerT("wishlist")}
          </Link>

          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-between rounded-md px-3 py-2.5 text-body font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart size={18} aria-hidden />
              {headerT("cart")}
            </div>
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff85a2] px-1 text-xs text-white dark:bg-[#e11d48]">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-body font-medium text-red-400 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 dark:text-red-600"
            >
              <LogOut size={18} aria-hidden />
              {headerT("logout")}
            </button>
          )}
        </div>

        <div className="mt-auto">
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
}
