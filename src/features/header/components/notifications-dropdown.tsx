"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, BellOff, Check, Trash2, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

const initialNotifications = [
  {
    id: 1,
    title: "Your Order Has Been Shipped",
    message:
      "Your order #12345 has been shipped and will arrive in 2-3 business days. We'll send you another update once it's out for delivery. In th...",
    isRead: false,
  },
  {
    id: 2,
    title: "Your Order Has Been Shipped",
    message:
      "Your order #12345 has been shipped and will arrive in 2-3 business days. We'll send you another update once it's out for delivery. In th...",
    isRead: true,
  },
];

interface NotificationsDropdownProps {
  initialCount?: number;
}

export function NotificationsDropdown({
  initialCount = 0,
}: NotificationsDropdownProps) {
  const t = useTranslations("header");
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const clearAll = () => setNotifications([]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  // فانكشن جديدة عشان تقرأ إشعار واحد وتقفل المنيو الصغيرة بس
  const markAsReadSingle = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    setActiveMenuId(null); // ده اللي بيقفل المنيو الصغيرة
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    setActiveMenuId(null);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        aria-label="Notifications"
        className="relative flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <Bell size={20} aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-[3px] text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] rounded-lg bg-white shadow-xl ring-1 ring-black/5 dark:bg-[#2b2b2b] dark:ring-white/10 z-50">
          <div className="bg-[#82202b] dark:bg-[#ffb6c1] px-4 py-3 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white dark:text-black">
              Notifications{" "}
              {notifications.length > 0 && `(${notifications.length})`}
            </h3>
          </div>

          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#333333] px-4 py-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Trash2 size={14} />
              Clear all notifications
            </button>
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Check size={14} />
              Mark all as read
            </button>
          </div>

          <div className="max-h-[350px] overflow-y-auto bg-white dark:bg-[#2b2b2b] rounded-b-lg">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BellOff size={48} className="mb-4 opacity-20" />
                <p className="text-sm">No notifications to display.</p>
              </div>
            ) : (
              <div className="flex flex-col pb-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative border-b border-zinc-100 dark:border-zinc-800 p-4 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${!notification.isRead ? "bg-red-50/30 dark:bg-red-950/10" : ""}`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {notification.message}
                        </p>
                      </div>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(
                              activeMenuId === notification.id
                                ? null
                                : notification.id,
                            );
                          }}
                          className="p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* تعديل مسار وستايل المنيو الصغيرة عشان ماتتقصش */}
                        {activeMenuId === notification.id && (
                          <div className="absolute right-0 top-7 w-[170px] rounded-md bg-white dark:bg-[#404040] shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-black/40 ring-1 ring-black/5 z-[60] p-1.5">
                            {!notification.isRead && (
                              <button
                                onClick={() =>
                                  markAsReadSingle(notification.id)
                                }
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-xs text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                              >
                                <Check size={14} />
                                <span className="truncate">Mark as read</span>
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <Trash2 size={14} />
                              <span className="truncate">
                                Delete notification
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
