import type { ReactNode } from "react";

interface ShowcaseSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ShowcaseSection({
  title,
  children,
  className,
}: ShowcaseSectionProps) {
  return (
    <section className={`space-y-6 ${className ?? ""}`}>
      <div className="border-b border-border pb-2">
        <h2 className="text-heading-lg font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function ShowcaseSubheading({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm font-medium text-muted-foreground block mb-3">
      {children}
    </span>
  );
}

export function TabPanel({ children }: { children: ReactNode }) {
  return <div className="p-4 bg-muted rounded-lg">{children}</div>;
}
