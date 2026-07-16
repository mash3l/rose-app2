import { ToastProvider } from "@/shared/ui";
import { ShowcaseContent } from "@/features/design-system/showcase-content";

export function DesignSystemShowcase() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8 md:p-12 lg:p-24 font-sans transition-colors duration-300">
      <ToastProvider>
        <ShowcaseContent />
      </ToastProvider>
    </main>
  );
}
