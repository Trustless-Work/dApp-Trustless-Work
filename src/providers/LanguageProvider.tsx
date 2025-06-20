"use client";

import { PropsWithChildren, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    // Ensure translations are loaded
    const loadTranslations = async () => {
      await i18n.reloadResources();
      await i18n.loadNamespaces("common");
    };

    loadTranslations();
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
