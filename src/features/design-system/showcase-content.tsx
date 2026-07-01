"use client";

import { useMemo, useState, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { Send, Search, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Badge } from "@/shared/ui/Badge";
import { Checkbox } from "@/shared/ui/Checkbox";
import { Input } from "@/shared/ui/Input";
import { Textarea } from "@/shared/ui/Textarea";
import { Select } from "@/shared/ui/Select";
import { Combobox } from "@/shared/ui/Combobox";
import { Tabs } from "@/shared/ui/Tabs";
import { OtpInput } from "@/shared/ui/OtpInput";
import { FileInput } from "@/shared/ui/FileInput";
import { Pagination, Breadcrumbs, useToast } from "@/shared/ui";
import { ShowcaseControls } from "./showcase-controls";
import {
  ShowcaseSection,
  ShowcaseSubheading,
  TabPanel,
} from "./showcase-section";
import {
  SHOWCASE_TOTAL_PAGES,
  OTP_LENGTH,
  SHOWCASE_TAB_BADGE_COUNT,
} from "./constants";

export function ShowcaseContent() {
  const t = useTranslations("showcase");

  const [isChecked, setIsChecked] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();

  const countryOptions = useMemo(
    () => [
      { value: "eg", label: t("countries.eg") },
      { value: "sa", label: t("countries.sa") },
      { value: "ae", label: t("countries.ae") },
    ],
    [t]
  );

  const showcaseTabs = useMemo(
    () => [
      {
        id: "tab1",
        label: t("tabs.active"),
        content: <TabPanel>{t("tabs.content1")}</TabPanel>,
      },
      {
        id: "tab2",
        label: t("tabs.inactive"),
        content: <TabPanel>{t("tabs.content2")}</TabPanel>,
      },
      {
        id: "tab3",
        label: t("tabs.disabled"),
        disabled: true,
        content: null,
      },
      {
        id: "tab4",
        label: t("tabs.updates"),
        badgeCount: SHOWCASE_TAB_BADGE_COUNT,
        content: <TabPanel>{t("tabs.contentUpdates")}</TabPanel>,
      },
    ],
    [t]
  );

  const breadcrumbItems = useMemo(
    () => [
      { label: t("breadcrumbs.home"), href: "/" },
      { label: t("breadcrumbs.designSystem"), href: "/design" },
      { label: t("breadcrumbs.components") },
    ],
    [t]
  );

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <header className="border-b border-border pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-display-md font-bold text-primary mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-body-lg">{t("subtitle")}</p>
        </div>
        <ShowcaseControls />
      </header>

      <ShowcaseSection title={t("sections.buttons")}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 items-start">
            <Button variant="primary">{t("buttons.primary")}</Button>
            <Button variant="primary" isLoading>
              {t("buttons.loading")}
            </Button>
            <Button variant="primary" disabled>
              {t("buttons.disabled")}
            </Button>
          </div>
          <div className="flex flex-col gap-4 items-start">
            <Button variant="secondary">{t("buttons.secondary")}</Button>
            <Button variant="outline">{t("buttons.outline")}</Button>
            <Button variant="ghost">{t("buttons.ghost")}</Button>
          </div>
          <div className="flex flex-col gap-4 items-start">
            <Button variant="destructive">{t("buttons.destructive")}</Button>
            <Button variant="primary" leftIcon={<Send size={18} />}>
              {t("buttons.withIcon")}
            </Button>
            <Button
              variant="outline"
              isIconOnly
              leftIcon={<Search size={18} aria-hidden />}
              aria-label={t("buttons.search")}
            />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={t("sections.badges")}>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="primary">{t("badges.primary")}</Badge>
          <Badge variant="secondary">{t("badges.secondary")}</Badge>
          <Badge variant="subtle">{t("badges.subtle")}</Badge>
          <Badge variant="outline">{t("badges.outline")}</Badge>
        </div>
        <div className="flex flex-wrap gap-4 items-center mt-4">
          <Badge variant="success">{t("badges.success")}</Badge>
          <Badge variant="warning">{t("badges.warning")}</Badge>
          <Badge variant="error">{t("badges.error")}</Badge>
          <Badge variant="info">{t("badges.info")}</Badge>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={t("sections.checkbox")}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Checkbox
            label={t("checkbox.default")}
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <Checkbox label={t("checkbox.indeterminate")} indeterminate />
          <Checkbox label={t("checkbox.disabled")} disabled />
          <Checkbox
            label={t("checkbox.error")}
            error
            errorMessage={t("checkbox.errorMessage")}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={t("sections.inputs")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t("inputs.standard")}
            placeholder={t("inputs.standardPlaceholder")}
          />
          <Input
            label={t("inputs.withIcon")}
            placeholder={t("inputs.searchPlaceholder")}
            leftIcon={<Search size={18} />}
          />
          <Input
            label={t("inputs.password")}
            type="password"
            placeholder={t("inputs.passwordPlaceholder")}
            defaultValue="password@12345"
          />
          <Input
            label={t("inputs.error")}
            placeholder={t("inputs.errorPlaceholder")}
            error
            errorMessage={t("inputs.errorMessage")}
            rightIcon={<AlertCircle size={18} className="text-danger" />}
          />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={t("sections.advancedInputs")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-2">
            <ShowcaseSubheading>{t("advanced.otpLabel")}</ShowcaseSubheading>
            <OtpInput value={otpValue} onChange={setOtpValue} length={OTP_LENGTH} />
            <p className="text-xs text-muted-foreground mt-2">
              {t("advanced.otpCurrentValue")}{" "}
              {otpValue || t("advanced.otpNone")}
            </p>
          </div>
          <FileInput label={t("advanced.fileUpload")} multiple maxSizeInMb={5} />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={t("sections.textareaSelect")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-6">
            <Textarea
              label={t("textarea.default")}
              placeholder={t("textarea.defaultPlaceholder")}
            />
            <Select label={t("select.default")}>
              <option value="1">{t("select.option1")}</option>
              <option value="2">{t("select.option2")}</option>
            </Select>
          </div>
          <div className="flex flex-col gap-6">
            <Textarea
              label={t("textarea.autoResize")}
              placeholder={t("textarea.autoResizePlaceholder")}
              autoResize
            />
            <Combobox
              label={t("combobox.label")}
              placeholder={t("combobox.placeholder")}
              options={countryOptions}
            />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={t("sections.tabs")}>
        <div className="w-full max-w-md">
          <Tabs tabs={showcaseTabs} />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={t("sections.navigation")}>
        <div className="flex flex-col gap-8">
          <div>
            <ShowcaseSubheading>{t("navigation.breadcrumbs")}</ShowcaseSubheading>
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <div>
            <ShowcaseSubheading>{t("navigation.pagination")}</ShowcaseSubheading>
            <Pagination
              currentPage={currentPage}
              totalPages={SHOWCASE_TOTAL_PAGES}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title={t("sections.toast")} className="pb-20">
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => toast(t("toast.successMessage"), "success")}
            variant="outline"
          >
            {t("toast.success")}
          </Button>
          <Button
            onClick={() => toast(t("toast.errorMessage"), "error")}
            variant="destructive"
          >
            {t("toast.error")}
          </Button>
          <Button
            onClick={() => toast(t("toast.warningMessage"), "warning")}
            variant="secondary"
          >
            {t("toast.warning")}
          </Button>
          <Button
            onClick={() => toast(t("toast.infoMessage"), "info")}
            variant="ghost"
          >
            {t("toast.info")}
          </Button>
        </div>
      </ShowcaseSection>
    </div>
  );
}
