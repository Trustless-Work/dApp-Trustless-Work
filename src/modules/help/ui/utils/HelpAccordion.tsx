import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/accordion";
import { useLanguage } from "@/hooks/useLanguage";
import { helpItemKeys } from "../../constants/help-items.constant";

export const HelpAccordion = () => {
  const { t } = useLanguage();

  return (
    <Accordion type="single" collapsible className="w-full">
      {helpItemKeys.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger className="text-left">
            {t(item.questionKey)}
          </AccordionTrigger>
          <AccordionContent>{t(item.answerKey)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
