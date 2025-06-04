import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { helpItemKeys } from "@/components/modules/help/constants/help-items.constant";
import { useLanguage } from "@/hooks/useLanguage";

const HelpAccordion = () => {
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

export default HelpAccordion;
