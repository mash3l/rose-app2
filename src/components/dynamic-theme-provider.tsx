"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import type { ThemeProvider as ThemeProviderComponent } from "@/components/theme-provider";

const ThemeProvider = dynamic(
  () => import("@/components/theme-provider").then((mod) => mod.ThemeProvider),
  { ssr: false },
);

export function DynamicThemeProvider(
  props: ComponentProps<typeof ThemeProviderComponent>,
) {
  return <ThemeProvider {...props} />;
}
