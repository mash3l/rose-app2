"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface DecorativeLineProps {
  className?: string;
}

export function DecorativeLine({ className = "" }: DecorativeLineProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`relative flex justify-center w-[280px] h-[45px] ${className}`}
      />
    );
  }

  const imageSrc =
    resolvedTheme === "dark"
      ? "/images/separator-2.png"
      : "/images/separator-1.png";

  return (
    <div
      className={`relative flex justify-center w-[280px] h-[45px] ${className}`}
    >
      <Image
        src={imageSrc}
        alt="Decorative separator"
        fill
        className="object-contain"
        priority
        unoptimized
      />
    </div>
  );
}
