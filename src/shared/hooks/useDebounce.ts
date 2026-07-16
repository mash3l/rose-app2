"use client";

import { useEffect, useState } from "react";

export function useDebounce<TValue>(value: TValue, delayInMs: number): TValue {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayInMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayInMs]);

  return debouncedValue;
}
