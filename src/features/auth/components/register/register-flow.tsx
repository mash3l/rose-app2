"use client";

import { useReducer } from "react";
import { useTranslations } from "next-intl";
import { Stepper, type StepperStep } from "@/shared/ui/Stepper";
import { RegisterEmailStep } from "./register-email-step";
import { RegisterOtpStep } from "./register-otp-step";
import {
  RegisterUserInfoStep,
  type UserInfoValues,
} from "./register-user-info-step";
import { RegisterPasswordStep } from "./register-password-step";

type RegisterStepNumber = 1 | 2 | 3 | 4;

type RegisterState = {
  step: RegisterStepNumber;
  email: string;
  userInfo: UserInfoValues | null;
};

type RegisterAction =
  | { type: "EMAIL_SUBMITTED"; email: string }
  | { type: "OTP_VERIFIED" }
  | { type: "USER_INFO_SUBMITTED"; userInfo: UserInfoValues }
  | { type: "STEP_BACK" };

const initialState: RegisterState = { step: 1, email: "", userInfo: null };

const FLOW_STACK_CLASS =
  "flex w-full flex-col gap-4 [@media(max-height:780px)]:gap-3 [@media(max-height:640px)]:gap-2";

const TITLE_CLASS =
  "text-4xl leading-none font-normal text-primary text-center [@media(max-height:780px)]:text-3xl [@media(max-height:640px)]:text-2xl";

function registerReducer(
  state: RegisterState,
  action: RegisterAction,
): RegisterState {
  switch (action.type) {
    case "EMAIL_SUBMITTED":
      return { ...state, step: 2, email: action.email };
    case "OTP_VERIFIED":
      return { ...state, step: 3 };
    case "USER_INFO_SUBMITTED":
      return { ...state, step: 4, userInfo: action.userInfo };
    case "STEP_BACK":
      return {
        ...state,
        step: Math.max(1, state.step - 1) as RegisterStepNumber,
      };
    default:
      return state;
  }
}

export function RegisterFlow() {
  const t = useTranslations("register");
  const [state, dispatch] = useReducer(registerReducer, initialState);

  const showStepper = state.step > 1;

  const stepperSteps: StepperStep[] = [
    { id: "email", ariaLabel: t("stepAriaLabel", { step: 1 }) },
    { id: "otp", ariaLabel: t("stepAriaLabel", { step: 2 }) },
    { id: "user-info", ariaLabel: t("stepAriaLabel", { step: 3 }) },
    { id: "password", ariaLabel: t("stepAriaLabel", { step: 4 }) },
  ];

  return (
    <div className={FLOW_STACK_CLASS}>
      <h1
        className={TITLE_CLASS}
        style={{ fontFamily: "var(--font-edwardian)" }}
      >
        {t("title")}
      </h1>

      {showStepper && (
        <>
          <Stepper steps={stepperSteps} currentStep={state.step} />
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-semibold text-foreground">
              {t("createAccount")}
            </h2>
            <p className="text-sm font-medium text-foreground">
              {t(`step${state.step}Title`)}
            </p>
            {state.step !== 2 && (
              <p className="text-xs text-muted-foreground">
                {t(`step${state.step}Description`)}
              </p>
            )}
          </div>
        </>
      )}

      {state.step === 1 && (
        <RegisterEmailStep
          defaultEmail={state.email}
          onSubmitted={(email) => dispatch({ type: "EMAIL_SUBMITTED", email })}
        />
      )}

      {state.step === 2 && (
        <RegisterOtpStep
          email={state.email}
          onVerified={() => dispatch({ type: "OTP_VERIFIED" })}
          onEditEmail={() => dispatch({ type: "STEP_BACK" })}
        />
      )}

      {state.step === 3 && (
        <RegisterUserInfoStep
          defaultValues={state.userInfo}
          onSubmitted={(userInfo) =>
            dispatch({ type: "USER_INFO_SUBMITTED", userInfo })
          }
        />
      )}

      {state.step === 4 && state.userInfo && (
        <RegisterPasswordStep email={state.email} userInfo={state.userInfo} />
      )}
    </div>
  );
}
