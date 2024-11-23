import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const helpItems = [
  {
    question: "How do I get started?",
    answer:
      "To get started, you'll need to create an account and verify your identity. Once that's done, you can initialize an escrow, fund it, and start using our services. For more detailed instructions, please refer to our user guide or contact our support team.",
  },
  {
    question: "What is an escrow?",
    answer:
      "An escrow is a financial arrangement where a third party holds and regulates payment of the funds required for two parties involved in a given transaction. It helps make transactions more secure by keeping the payment in a secure escrow account which is only released when all of the terms of an agreement are met.",
  },
  {
    question: "How do I initialize an escrow?",
    answer:
      "To initialize an escrow, navigate to the 'Initialize Escrow' page from the main menu. You'll need to provide details such as the parties involved, the terms of the agreement, and the amount to be held in escrow. Follow the on-screen instructions to complete the process.",
  },
  {
    question: "How do I fund an escrow?",
    answer:
      "To fund an escrow, go to the 'Fund Escrow' page. You'll need to enter the Contract ID and Engagement ID for the escrow you want to fund. Then, follow the prompts to complete the funding process. Make sure you have sufficient funds in your account before initiating the transfer.",
  },
  {
    question: "How do I complete an escrow?",
    answer:
      "Completing an escrow involves verifying that all conditions of the agreement have been met. Navigate to the 'Complete Escrow' page, enter the required information, and confirm the completion. This will trigger the release of funds to the appropriate party as per the escrow agreement.",
  },
];

export function HelpAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {helpItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger className="text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
