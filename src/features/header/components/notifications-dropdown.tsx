"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, BellOff, Check, Trash2, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";

import {
  formatTimeAgo,
  formatUnreadBadgeCount,
} from "@/features/format-time-ago";
import {
  useNotificationsQuery,
  type Notification,
} from "@/features/header/api/get-notifications";

interface NotificationsDropdownProps {
  initialCount?: number;
}

export function NotificationsDropdown({
  initialCount = 0,
}: NotificationsDropdownProps) {
  // Translation
  const t = useTranslations("notifications");

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  // Ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Query
  const { data: session } = useSession();
  const {
    data: fetchedNotifications,
    isLoading,
    isError,
  } = useNotificationsQuery(session?.accessToken);

  // Variables (derived)
  const notifications = (fetchedNotifications ?? [])
    .filter((notification) => !deletedIds.has(notification.id))
    .map((notification) => ({
      ...notification,
      isRead: notification.isRead || readIds.has(notification.id),
    }));
  const status = isLoading ? "loading" : isError ? "error" : "success";
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayedUnreadCount = formatUnreadBadgeCount(
    status === "success" ? unreadCount : initialCount,
  );

  // Functions (handlers)
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const closeMenus = () => {
    setIsOpen(false);
    setActiveMenuId(null);
  };

  const clearAll = () => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      return next;
    });
  };

  const markAllAsRead = () => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.id));
      return next;
    });
  };

  const markAsReadSingle = (id: string) => {
    setReadIds((prev) => new Set(prev).add(id));
    setActiveMenuId(null);
  };

  const deleteNotification = (id: string) => {
    setDeletedIds((prev) => new Set(prev).add(id));
    setActiveMenuId(null);
  };

  const toggleNotificationMenu = (id: string) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  // Effects
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeMenus();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        aria-label={t("title")}
        className="relative flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Bell size={20} aria-hidden />
        {Number(displayedUnreadCount.replace("+", "")) > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-[3px] text-[10px] font-bold text-white">
            {displayedUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[340px] rounded-lg bg-white shadow-xl ring-1 ring-black/5 dark:bg-[#2b2b2b] dark:ring-white/10">
          <div className="rounded-t-lg bg-[#82202b] px-4 py-3 dark:bg-[#ffb6c1]">
            <h3 className="text-lg font-semibold text-white dark:text-black">
              {t("title")}
              {notifications.length > 0 && ` (${notifications.length})`}
            </h3>
          </div>

          <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2 dark:border-zinc-700 dark:bg-[#333333]">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Trash2 size={14} />
              {t("clearAll")}
            </button>
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Check size={14} />
              {t("markAllRead")}
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto rounded-b-lg bg-white dark:bg-[#2b2b2b]">
            {status === "loading" && <NotificationsSkeleton />}

            {status === "error" && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BellOff size={48} className="mb-4 opacity-20" />
                <p className="text-sm">{t("loadError")}</p>
              </div>
            )}

            {status === "success" && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BellOff size={48} className="mb-4 opacity-20" />
                <p className="text-sm">{t("empty")}</p>
              </div>
            )}

            {status === "success" && notifications.length > 0 && (
              <div className="flex flex-col pb-2">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isMenuOpen={activeMenuId === notification.id}
                    onToggleMenu={() => toggleNotificationMenu(notification.id)}
                    onMarkRead={() => markAsReadSingle(notification.id)}
                    onDelete={() => deleteNotification(notification.id)}
                    markReadLabel={t("markRead")}
                    deleteLabel={t("delete")}
                    timeAgoLabel={formatTimeAgo(
                      new Date(notification.createdAt),
                      t,
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationsSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {[1, 2, 3].map((key) => (
        <div key={key} className="flex animate-pulse flex-col gap-2">
          <div className="h-3.5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
  markReadLabel: string;
  deleteLabel: string;
  timeAgoLabel: string;
}

function NotificationItem({
  notification,
  isMenuOpen,
  onToggleMenu,
  onMarkRead,
  onDelete,
  markReadLabel,
  deleteLabel,
  timeAgoLabel,
}: NotificationItemProps) {
  return (
    <div
      className={[
        "relative border-b border-zinc-100 p-4 transition-colors last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50",
        !notification.isRead ? "bg-red-50/30 dark:bg-red-950/10" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="mb-1 text-sm font-semibold text-foreground">
            {notification.title}
          </h4>
          <p className="mb-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {notification.message}
          </p>
          <span className="text-[11px] text-muted-foreground/70">
            {timeAgoLabel}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleMenu();
            }}
            aria-label={markReadLabel}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <MoreVertical size={16} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-7 z-[60] w-[170px] rounded-md bg-white p-1.5 shadow-[0_0_15px_rgba(0,0,0,0.1)] ring-1 ring-black/5 dark:bg-[#404040] dark:shadow-black/40">
              {!notification.isRead && (
                <button
                  onClick={onMarkRead}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-xs text-muted-foreground transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                  <Check size={14} />
                  <span className="truncate">{markReadLabel}</span>
                </button>
              )}
              <button
                onClick={onDelete}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-xs text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 size={14} />
                <span className="truncate">{deleteLabel}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
