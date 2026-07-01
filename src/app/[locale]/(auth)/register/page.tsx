import { getTranslations } from "next-intl/server";
import { RegisterForm } from "@/features/auth/components/register-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "register" });
  return {
    title: t("title"),
  };
}

export default function RegisterPage() {
  return <RegisterForm />;
}
