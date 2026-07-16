"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// next-themes injects an inline <script> tag inside a Client Component to
// prevent a "flash" of the wrong theme before hydration. This is intentional
// and works correctly, but React 19 + Next.js 16.2+ now logs a warning about
// script tags inside components. This is a known false positive
// (see https://github.com/pacocoursey/next-themes/issues/387), so we filter
// out just this specific message in development.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
