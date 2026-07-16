import { ReactNode } from "react";
import Image from "next/image";
import { DecorativeLine } from "@/shared/ui/DecorativeLine";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-dvh w-full overflow-hidden bg-background rtl:flex-row-reverse">
      <section className="relative flex h-full w-full flex-col overflow-hidden lg:w-1/2">
        <div className="flex h-full flex-col items-center justify-center overflow-hidden px-6">
          <div
            className="
              flex w-full max-w-[406px] flex-col
              gap-2 py-3
              [@media(max-height:780px)]:gap-3
              [@media(max-height:780px)]:py-4
              [@media(max-height:640px)]:gap-2
              [@media(max-height:640px)]:py-3
            "
          >
            <div className="flex w-full justify-end gap-4">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            <div className="flex flex-col items-center gap-3 [@media(max-height:560px)]:hidden">
              <DecorativeLine />
              <div className="w-full h-px bg-border" />
            </div>

            <div className="w-full">{children}</div>

            <div className="flex justify-center [@media(max-height:620px)]:hidden">
              <DecorativeLine />
            </div>
          </div>
        </div>
      </section>

      <section className="relative hidden h-full lg:block lg:w-1/2">
        <Image
          src="/images/auth-cover.jpg"
          alt="Auth cover"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
      </section>
    </main>
  );
}
