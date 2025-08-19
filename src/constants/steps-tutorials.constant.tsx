import { t } from "i18next";
import Image from "next/image";
import { Placement } from "react-joyride";

export const steps = [
  {
    title: <strong>{t("onboarding.steps.welcome.title")}</strong>,
    content: (
      <>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          <Image
            src="/logo.png"
            alt={t("onboarding.steps.welcome.logoAlt")}
            width={100}
            height={100}
            style={{ marginBottom: "10px" }}
          />
        </div>
        <h2>{t("onboarding.steps.welcome.content")}</h2>
      </>
    ),
    placement: "center" as Placement,
    target: "body",
  },
  {
    title: <strong>{t("onboarding.steps.1.title")}</strong>,
    content: <h2>{t("onboarding.steps.1.content")}</h2>,
    placement: "auto" as Placement,
    target: "#step-1",
  },
  {
    title: <strong>{t("onboarding.steps.2.title")}</strong>,
    content: <h2>{t("onboarding.steps.2.content")}</h2>,
    placement: "auto" as Placement,
    target: "#step-2",
  },
  {
    title: <strong>{t("onboarding.steps.3.title")}</strong>,
    content: <h2>{t("onboarding.steps.3.content")}</h2>,
    placement: "auto" as Placement,
    target: "#step-3",
  },
];
