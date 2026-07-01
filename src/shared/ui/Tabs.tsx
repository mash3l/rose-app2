"use client";

import React, { useState } from "react";

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badgeCount?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
}

export const Tabs = ({ tabs, defaultTab, onChange }: TabsProps) => {
  const initialTab =
    defaultTab || tabs.find((t) => !t.disabled)?.id || tabs[0]?.id;
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabClick = (tabId: string, disabled?: boolean) => {
    if (disabled) return;
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="flex w-full items-center p-0 rounded-[10px] border border-border bg-card overflow-hidden"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              onClick={() => handleTabClick(tab.id, tab.disabled)}
              className={[
                "flex-1 flex items-center justify-center gap-2 h-[44px] px-4 py-[14px]",
                "text-sm font-medium transition-all duration-200 outline-none",
                "focus-visible:ring-4 focus-visible:ring-primary/25 focus-visible:z-10 relative",
                isActive
                  ? tab.disabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary-hover text-white hover:bg-primary dark:bg-soft-pink-300 dark:text-zinc-900 dark:hover:bg-soft-pink-400"
                  : tab.disabled
                    ? "bg-transparent text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-transparent text-foreground hover:bg-muted/50",
              ].join(" ")}
            >
              {tab.label}

              {tab.badgeCount !== undefined && (
                <span
                  className={[
                    "inline-flex items-center justify-center px-1.5 min-w-[20px] h-5 text-[10px] font-bold rounded-full",
                    isActive
                      ? "bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900"
                      : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {tab.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="py-4 focus-visible:outline-none" role="tabpanel" tabIndex={0}>
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
};
