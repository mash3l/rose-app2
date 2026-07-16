import { Suspense } from "react";
import { HeaderServer } from "@/features/header/components/header-server";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-50 w-full flex flex-col">
        <Suspense
          fallback={
            <div className="h-[72px] w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse border-b border-zinc-200 dark:border-zinc-800" />
          }
        >
          <HeaderServer />
        </Suspense>
      </header>
      <main className="flex-1">{children}</main>
    </>
  );
}
