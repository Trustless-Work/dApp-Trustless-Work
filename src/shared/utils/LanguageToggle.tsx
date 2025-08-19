"use client";

import { Globe } from "lucide-react";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", nameKey: "language.english" },
  { code: "es", nameKey: "language.spanish" },
];

const LanguageToggle = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation("common");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-0"
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("header.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={cn(
              "flex gap-2 cursor-pointer",
              currentLanguage === language.code && "bg-accent",
            )}
          >
            {t(language.nameKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
