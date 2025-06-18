import { useTranslation } from "react-i18next";

export const useLanguage = () => {
  const { i18n, t } = useTranslation("common");

  const changeLanguage = async (language: string) => {
    localStorage.removeItem("i18nextLng");

    await i18n.reloadResources();
    await i18n.changeLanguage(language);
  };

  return {
    currentLanguage: i18n.language,
    changeLanguage,
    t,
  };
};
