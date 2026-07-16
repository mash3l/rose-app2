"use client";

import { useState } from "react";
import { Heart, Menu, ShoppingCart, User, MapPin, Bell } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/routing";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/features/header/components/logo";
import { SearchBar } from "@/features/header/components/search-bar";
import { UserDropdown } from "@/features/header/components/user-dropdown";
import { NotificationsDropdown } from "@/features/header/components/notifications-dropdown";
import { MobileMenuDrawer } from "@/features/header/components/mobile-menu-drawer";

interface MainHeaderProps {
  isAuthenticated?: boolean;
  userName?: string;
  deliveryLocation?: string;
  cartCount?: number;
  notificationCount?: number;
}

export function MainHeader({
  isAuthenticated = false,
  userName = "",
  deliveryLocation = "",
  cartCount = 0,
  notificationCount = 0,
}: MainHeaderProps) {
  const t = useTranslations("header");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const openMobileMenu = () => setIsMobileMenuOpen(true);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="w-full bg-header-bg">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-3 px-4 py-3 lg:h-[88px] lg:flex-row lg:items-center lg:gap-4 lg:px-9 lg:py-[18px]">
        <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-start">
          <Logo />

          {isAuthenticated && (
            <div className="hidden items-center gap-1.5 ms-4 border-s border-zinc-400 ps-4 lg:flex">
              <MapPin
                size={20}
                className="text-[#ff85a2] dark:text-[#e11d48]"
              />
              <div className="flex flex-col text-sm">
                <span className="text-xs text-muted-foreground leading-none">
                  {t("deliverTo")}
                </span>
                <span className="font-semibold text-foreground leading-none">
                  {deliveryLocation}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={openMobileMenu}
            aria-label={t("openMenu")}
            className="flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 lg:hidden"
          >
            <Menu size={24} aria-hidden />
          </button>
        </div>

        <div className="w-full lg:flex-1 lg:ms-4">
          <SearchBar />
        </div>

        <div className="hidden h-[52px] items-center gap-1.5 border-s border-zinc-400 ps-4 lg:flex">
          {isAuthenticated ? (
            // التعديل هنا: استخدمنا المكون بتاعك بدل الزرار الثابت
            <UserDropdown userName={userName} />
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-body font-normal text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md px-1"
            >
              <User size={20} aria-hidden />
              {t("login")}
            </Link>
          )}
        </div>

        <div className="hidden h-[52px] items-center gap-4 border-s border-zinc-400 ps-4 lg:flex">
          <Link
            href="/wishlist"
            aria-label={t("wishlist")}
            className="flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Heart size={20} aria-hidden />
          </Link>

          <Link
            href="/cart"
            aria-label={t("cart")}
            className="relative flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <ShoppingCart size={20} aria-hidden />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-[3px] text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated && (
            <NotificationsDropdown initialCount={notificationCount} />
          )}
        </div>

        <div className="hidden h-[52px] items-center gap-3 border-s border-zinc-400 ps-4 lg:flex [&_button:hover]:text-primary [&_button]:text-muted-foreground [&_button]:transition-colors">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        isAuthenticated={isAuthenticated}
        userName={userName}
        deliveryLocation={deliveryLocation}
        cartCount={cartCount}
        notificationCount={notificationCount}
      />
    </div>
  );
}
