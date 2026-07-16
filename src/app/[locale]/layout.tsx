import type { Metadata } from "next";
import { Sarabun, Tajawal, Cairo } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/providers/QueryProvider";
import { NextAuthSessionProvider } from "@/providers/session-provider";
import { DynamicThemeProvider } from "@/components/dynamic-theme-provider";
import { ToastProvider } from "@/shared/ui/ToastProvider";
import "@/app/globals.css";
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
});
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});
const edwardianScript = localFont({
  src: "../../fonts/EdwardianScriptITC.ttf",
  variable: "--font-edwardian",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Rose App",
  description: "Rose App Application",
};
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={[
          sarabun.variable,
          tajawal.variable,
          cairo.variable,
          edwardianScript.variable,
          "flex min-h-screen flex-col antialiased",
        ].join(" ")}
        suppressHydrationWarning
      >
        <DynamicThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            <NextAuthSessionProvider>
              <QueryProvider>
                <ToastProvider>
                  <main className="flex-1">{children}</main>
                </ToastProvider>
              </QueryProvider>
            </NextAuthSessionProvider>
          </NextIntlClientProvider>
        </DynamicThemeProvider>
      </body>
    </html>
  );
}
