"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  MapPin,
  FileText,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";

import { Link } from "@/i18n/routing";
import type { UserRole } from "@/lib/auth";

interface UserDropdownProps {
  userName: string;
  userRole?: UserRole;
}

export function UserDropdown({ userName, userRole }: UserDropdownProps) {
  const t = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-md px-1 text-body font-normal text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <div className="flex flex-col text-start">
          <span className="text-xs leading-none opacity-70">{t("hello")}</span>
          <span className="font-semibold leading-none">{userName}</span>
        </div>
        <ChevronDown
          size={16}
          className={[
            "mt-2 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full z-50 mt-2 w-56 rounded-md border border-zinc-200 bg-white py-2 shadow-lg dark:border-zinc-700 dark:bg-[#27272a]">
          <div className="border-b border-zinc-100 px-4 py-2 dark:border-zinc-700/50">
            <p className="font-semibold text-[#8b1832] dark:text-[#ff85a2]">
              {userName}
            </p>
          </div>

          <div className="flex flex-col py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/50"
            >
              <User size={16} />
              {t("myProfile")}
            </Link>
            <Link
              href="/addresses"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/50"
            >
              <MapPin size={16} />
              {t("myAddresses")}
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/50"
            >
              <FileText size={16} />
              {t("myOrders")}
            </Link>

            {userRole === "ADMIN" && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/50"
              >
                <LayoutDashboard size={16} />
                {t("dashboard")}
              </Link>
            )}
          </div>

          <div className=" border-t border-zinc-100 py-1 dark:border-zinc-700/50">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700/50"
            >
              <LogOut size={16} />
              {t("logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
