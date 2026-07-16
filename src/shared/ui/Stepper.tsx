"use client";

import type { ReactNode } from "react";

export interface StepperStep {
  id: string;
  label?: ReactNode;
  ariaLabel?: string;
}

interface StepperProps {
  steps: StepperStep[];
  /** 1-based index of the active step */
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className = "" }: StepperProps) {
  return (
    <ol className={`flex w-full items-center ${className}`}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;
        const isLastStep = stepNumber === steps.length;

        return (
          <li key={step.id} className="flex flex-1 items-center last:flex-none">
            <StepDot
              number={stepNumber}
              isCompleted={isCompleted}
              isActive={isActive}
              label={step.label}
              ariaLabel={step.ariaLabel}
            />
            {!isLastStep && <StepConnector isFilled={isCompleted} />}
          </li>
        );
      })}
    </ol>
  );
}

function StepDot({
  number,
  isCompleted,
  isActive,
  label,
  ariaLabel,
}: {
  number: number;
  isCompleted: boolean;
  isActive: boolean;
  label?: ReactNode;
  ariaLabel?: string;
}) {
  const isFilled = isCompleted || isActive;
  const resolvedAriaLabel =
    ariaLabel ?? (typeof label === "string" ? label : undefined);

  return (
    <div
      aria-current={isActive ? "step" : undefined}
      aria-label={resolvedAriaLabel}
      className={[
        "flex size-[25px] shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
        isFilled ? "bg-maroon-800 text-card" : "bg-primary-light text-primary",
      ].join(" ")}
    >
      {number}
    </div>
  );
}

function StepConnector({ isFilled }: { isFilled: boolean }) {
  return (
    <div
      aria-hidden
      className={[
        "mx-1 h-px flex-1 transition-colors",
        isFilled ? "bg-maroon-800" : "bg-muted",
      ].join(" ")}
    />
  );
}
